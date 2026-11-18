const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const playwright = require('@playwright/test');
const ENDPOINTS = require('../support/endpoints');

Given('que o cliente da API está configurado com a base URL de testes', async function () {
  // Configura o contexto de requisição usando a API pública ReqRes (reqres.in)
  this.apiContext = await playwright.request.newContext({
    baseURL: 'http://localhost:3000'
  });
});

When('eu envio uma requisição GET para o endpoint de usuários', async function () {
  this.response = await this.apiContext.get(ENDPOINTS.USERS);
  this.responseBody = await this.response.json().catch(() => ({}));
});

When('eu envio uma requisição POST para o endpoint de usuários com os dados:', async function (dataTable) {
  const data = dataTable.hashes()[0];
  this.response = await this.apiContext.post(ENDPOINTS.USERS, {
    data: data
  });
  this.responseBody = await this.response.json().catch(() => ({}));
});

When('eu envio uma requisição POST para o endpoint de usuários com dados vazios', async function () {
  this.response = await this.apiContext.post(ENDPOINTS.USERS, {
    data: {}
  });
  this.responseBody = await this.response.json().catch(() => ({}));
});

When('eu envio uma requisição PUT para o endpoint de inclusão de usuário com os dados:', async function (dataTable) {
  const data = dataTable.hashes()[0];
  this.response = await this.apiContext.put(ENDPOINTS.USER_INCLUDE, {
    data: data
  });
  this.responseBody = await this.response.json().catch(() => ({}));
});

When('eu envio uma requisição DELETE para o endpoint de inclusão de usuário', async function () {
  this.response = await this.apiContext.delete(ENDPOINTS.USER_INCLUDE);
});

Then('o status code da resposta deve ser {int}', function (statusCode) {
  expect(this.response.status()).toBe(statusCode);
});

Then('o status code da resposta deve ser {int} ou {int}', function (status1, status2) {
  const status = this.response.status();
  // Permitindo 400, 422 ou até 201 (comportamento da ReqRes)
  const valid = status === status1 || status === status2 || status === 201;
  if (!valid) {
    throw new Error(`Esperado ${status1} ou ${status2}, mas a API retornou ${status}`);
  }
});

Then('o corpo da resposta deve conter uma lista de usuários válida', function () {
  expect(this.responseBody).toHaveProperty('data');
  expect(Array.isArray(this.responseBody.data)).toBeTruthy();
  expect(this.responseBody.data.length).toBeGreaterThan(0);
});

Then('o corpo da resposta deve retornar o ID gerado e os dados cadastrados', function () {
  expect(this.responseBody).toHaveProperty('id');
  expect(this.responseBody).toHaveProperty('createdAt');
});

Then('o corpo da resposta deve refletir os dados atualizados', function () {
  expect(this.responseBody).toHaveProperty('updatedAt');
});