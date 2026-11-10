// support/world.js
const { setWorldConstructor, World,setDefaultTimeout, Before, After } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');
const path = require('path');
const url = require('url');
const fs = require('fs');
const LoginPage = require('../pages/LoginPage');
const DashboardPage = require('../pages/DashboardPage');
const CheckoutPage = require('../pages/CheckoutPage');
setDefaultTimeout(15 * 1000);
// Função para limpar pastas temp_recordings vazias dentro de test-results/videos
function cleanEmptyTempFolders() {
  const videosRoot = path.resolve(__dirname, '../test-results/videos');
  if (fs.existsSync(videosRoot)) {
    try {
      const items = fs.readdirSync(videosRoot);
      items.forEach(item => {
        if (item.startsWith('temp_recordings_')) {
          const tempPath = path.join(videosRoot, item);
          if (fs.statSync(tempPath).isDirectory()) {
            // Verifica se a pasta está vazia
            const files = fs.readdirSync(tempPath);
            if (files.length === 0) {
              fs.rmdirSync(tempPath);
            }
          }
        }
      });
    } catch (e) {
      // Ignora caso esteja em uso por algum processo ativo
    }
  }
}
// Função auxiliar para formatar a data/hora: dd-MM-yyyy - hhMMss
function getFormattedTimestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  
  const day = pad(now.getDate());
  const month = pad(now.getMonth() + 1);
  const year = now.getFullYear();
  
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  return `${day}-${month}-${year} - ${hours}${minutes}${seconds}`;
}

class CustomWorld extends World {
  constructor(options) {
    super(options);
    this.browser = null;
    this.context = null;
    this.page = null;
    this.timestampFolder = getFormattedTimestamp();
  }

  async initBrowser() {
    if (!this.browser) {
      this.browser = await chromium.launch({ 
        headless: true, 
        slowMo: 100 // Podemos diminuir um pouco o slowMo agora que está rodando junto!
      });
      
      // Cria um contexto totalmente isolado para este cenário específico
      this.context = await this.browser.newContext({
        recordVideo: { dir: `test-results/videos/temp_recordings_${Date.now()}_${Math.floor(Math.random() * 1000)}/` }
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
    if (this.browser) {
      const video = this.page.video();
      const videoPath = video ? await video.path() : null;
      const originalFileName = videoPath ? path.basename(videoPath) : null;

      // Descobre se passou ou falhou diretamente inspecionando o objeto scenario aqui dentro
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

      if (videoPath && fs.existsSync(videoPath) && originalFileName) {
        const statusFolder = isPassed ? 'Passed' : 'Failed';
        const targetDir = path.resolve(__dirname, `../test-results/videos/${statusFolder}/${this.timestampFolder}`);
        
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }

        const newVideoPath = path.join(targetDir, originalFileName);
        fs.renameSync(videoPath, newVideoPath);
      }
    }
    cleanEmptyTempFolders();
  }

}

setWorldConstructor(CustomWorld);

Before(async function (scenario) {
  // Pega todas as tags do cenário atual
  const tags = scenario.pickle.tags.map(t => t.name);

  // Se o cenário for de API (ou não for uma tag de UI/E2E), NÃO abre o navegador
  if (tags.includes('@api') || !tags.includes('@e2e')) {
    return;
  }

  // Caso contrário, abre o navegador normalmente para o E2E
  if (this.initBrowser) {
    await this.initBrowser();
  }
});

After(async function (scenario) {
  const tags = scenario.pickle.tags.map(t => t.name);

  // Se for API ou não for E2E, não tenta fechar browser nem salvar vídeo
  if (tags.includes('@api') || !tags.includes('@e2e')) {
    return;
  }

  // Caso contrário, fecha o browser e salva os artefatos do E2E
  if (this.closeBrowser) {
    await this.closeBrowser(scenario);
  }
});