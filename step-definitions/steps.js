// step-definitions/steps.js
const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Before(async function () {
  await this.initBrowser();
});

After(async function () {
  await this.closeBrowser();
});

Given('que o usuário acessa a página da aplicação web', { timeout: 30000 }, async function () {
  await this.page.goto(this.localUrl);
});

When('eu preencho o login com usuário {string} e senha {string}', async function (user, pass) {
  await this.loginPage.preencherLogin(user, pass);
});

When('clico no botão de entrar', async function () {
  await this.loginPage.clicarEmEntrar();
});

Then('devo visualizar o painel de boas-vindas com o usuário {string}', async function (user) {
  const welcomeText = await this.dashboardPage.obterMensagemBoasVindas();
  expect(welcomeText).toContain(user);
});

When('preencho o formulário de cadastro com dados válidos:', async function (dataTable) {
  const data = dataTable.rowsHash();
  await this.dashboardPage.preencherFormularioPerfil(data);
});

When('clico em salvar informações completa', async function () {
  await this.dashboardPage.salvarPerfil();
});

Then('devo ver a mensagem de sucesso do modal {string}', async function (expectedTitle) {
  const modalTitle = await this.checkoutPage.obterTituloModal();
  expect(modalTitle).toContain(expectedTitle);
});

Then('devo ver a mensagem de erro do modal {string}', async function (expectedTitle) {
  const modalTitle = await this.checkoutPage.obterTituloModal();
  expect(modalTitle).toContain(expectedTitle);
});

When('navego para a seção de e-commerce', async function () {
  await this.dashboardPage.irParaEcommerce();
});

When('adiciono o produto {string} ao carrinho', async function (productName) {
  await this.checkoutPage.adicionarProdutoAoCarrinho(productName);
});

When('preencho o endereço de entrega {string}', async function (address) {
  await this.checkoutPage.preencherCheckout(address, null);
});

When('preencho o número do cartão {string}', async function (cardNumber) {
  await this.checkoutPage.preencherCheckout(null, cardNumber);
});

When('clico em finalizar compra', async function () {
  await this.checkoutPage.finalizarCompra();
});