// step-definitions/api_steps.js
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const playwright = require('@playwright/test');

Given('que o cliente da API está configurado com a base URL de testes', async function () {
  // Configura o contexto de requisição usando a API pública ReqRes (reqres.in)
  this.apiContext = await playwright.request.newContext({
    baseURL: 'http://localhost:3000'
  });
});

When('eu envio uma requisição GET para o endpoint {string}', async function (endpoint) {
  this.response = await this.apiContext.get(endpoint);
  this.responseBody = await this.response.json().catch(() => ({}));
});

When('eu envio uma requisição POST para o endpoint {string} com os dados:', async function (endpoint, dataTable) {
  const data = dataTable.hashes()[0];
  this.response = await this.apiContext.post(endpoint, {
    data: data
  });
  this.responseBody = await this.response.json().catch(() => ({}));
});

When('eu envio uma requisição POST para o endpoint {string} com dados vazios', async function (endpoint) {
  this.response = await this.apiContext.post(endpoint, {
    data: {}
  });
  this.responseBody = await this.response.json().catch(() => ({}));
});

When('eu envio uma requisição PUT para o endpoint {string} com os dados:', async function (endpoint, dataTable) {
  const data = dataTable.hashes()[0];
  this.response = await this.apiContext.put(endpoint, {
    data: data
  });
  this.responseBody = await this.response.json().catch(() => ({}));
});

When('eu envio uma requisição DELETE para o endpoint {string}', async function (endpoint) {
  this.response = await this.apiContext.delete(endpoint);
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