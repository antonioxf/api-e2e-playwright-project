// support/world.js
const { setWorldConstructor, World, setDefaultTimeout, Before, After } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');
const path = require('path');
const url = require('url');
const fs = require('fs');
const LoginPage = require('../pages/LoginPage');
const DashboardPage = require('../pages/DashboardPage');
const CheckoutPage = require('../pages/CheckoutPage');

setDefaultTimeout(15 * 1000);

function cleanEmptyTempFolders() {
  const videosRoot = path.resolve(__dirname, '../test-results/videos');
  if (fs.existsSync(videosRoot)) {
    try {
      const items = fs.readdirSync(videosRoot);
      items.forEach(item => {
        if (item.startsWith('temp_recordings_')) {
          const tempPath = path.join(videosRoot, item);
          if (fs.statSync(tempPath).isDirectory()) {
            const files = fs.readdirSync(tempPath);
            if (files.length === 0) {
              fs.rmdirSync(tempPath);
            }
          }
        }
      });
    } catch (e) {}
  }
}

function getFormattedTimestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()} - ${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

class CustomWorld extends World {
  constructor(options) {
    super(options);
    this.browser = null;
    this.context = null;
    this.page = null;
    this.timestampFolder = getFormattedTimestamp();
  }

  async initBrowser(scenario) {
    // BLINDAGEM CENTRALIZADA: Se o cenário tiver a tag @api ou NÃO tiver @e2e, ele aborta aqui mesmo!
    const tags = scenario && scenario.pickle && scenario.pickle.tags 
      ? scenario.pickle.tags.map(t => t.name.toLowerCase()) 
      : [];

    if (tags.includes('@api') || !tags.includes('@e2e')) {
      return; // Sai sem abrir absolutamente nada do Playwright para testes de API!
    }

    if (!this.browser) {
      this.browser = await chromium.launch({ 
        headless: true, 
        slowMo: 100 
      });
      
      const scenarioName = scenario && scenario.pickle && scenario.pickle.name 
        ? scenario.pickle.name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50) 
        : 'teste';

      this.context = await this.browser.newContext({
        recordVideo: { 
          dir: `test-results/videos/temp_recordings_${scenarioName}_${Date.now()}/` 
        }
      });
      
      this.page = await this.context.newPage();
      
      this.loginPage = new LoginPage(this.page);
      this.dashboardPage = new DashboardPage(this.page);
      this.checkoutPage = new CheckoutPage(this.page);

      const htmlPath = path.resolve(__dirname, '../app/e2e/index.html');
      this.localUrl = url.pathToFileURL(htmlPath).href;
    }
  }

  async closeBrowser(scenario) {
    // Se nunca abriu página/browser (ex: testes de API), apenas ignora e sai fora
    if (!this.page || !this.browser) {
      return;
    }

    try {
      const video = this.page.video();
      const videoPath = video ? await video.path() : null;
      const originalFileName = videoPath ? path.basename(videoPath) : null;

      let isPassed = true;
      if (scenario && scenario.result) {
        if (typeof scenario.result.passed === 'boolean') {
          isPassed = scenario.result.passed;
        } else if (scenario.result.status) {
          isPassed = String(scenario.result.status).toUpperCase() === 'PASSED';
        }
      }

      await this.page.close();
      await this.context.close();
      await this.browser.close();
      this.browser = null;
      this.page = null;

      if (videoPath && fs.existsSync(videoPath) && originalFileName) {
        const statusFolder = isPassed ? 'Passed' : 'Failed';
        const targetDir = path.resolve(__dirname, `../test-results/videos/${statusFolder}/${this.timestampFolder}`);
        
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }

        const newVideoPath = path.join(targetDir, originalFileName);
        fs.renameSync(videoPath, newVideoPath);
      }
    } catch (e) {}
    cleanEmptyTempFolders();
  }
}

setWorldConstructor(CustomWorld);

// Os hooks viram apenas chamadas limpas, delegando a inteligência para a classe World
Before(async function (scenario) {
  await this.initBrowser(scenario);
});

After(async function (scenario) {
  await this.closeBrowser(scenario);
});