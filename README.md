# 🚀 Suite de Automação de Testes (API & E2E com Cucumber & Playwright + CI/CD com Github Actions)

Suíte de testes automatizados de ponta a ponta (E2E) e de integração (API) desenvolvida em **Node.js**, utilizando **Cucumber.js** (BDD) integrado ao **Playwright** para testes de interface e requisições HTTP para validação de contratos e regras de negócio de API, utilizando pipeline CI/CD com Github Actions.

---

## 📂 Arquitetura & Estrutura de Pastas

A estrutura do projeto foi organizada para garantir alta escalabilidadade, isolamento de responsabilidades e fácil manutenção:

```text
├── .github/
│   └── workflows/
│       └── qa-pipeline.yml      # Pipeline de CI/CD (GitHub Actions para API e E2E)
├── app/
│   └── api/
│       └── server.js            # Servidor mock em JavaScript com Express (API backend)
│   └── e2e/
│       └── index.html           # Aplicação frontend local para testes E2E feita em HTML + JavaScript
├── features/
│   └── api/
│       └── api_tests.feature        # Cenários BDD de teste de API (@api)
│   └── e2e/
│       └── ui_tests.feature        # Cenários BDD de interface/UI (@e2e)
├── pages/
│   └── LoginPage.js             # Page Object para a tela de Login
│   └── DashboardPage.js         # Page Object para a tela de Dashboard
│   └── CheckoutPage.js          # Page Object para a tela de Checkout/Fluxo
├── support/
│   └── world.js                 # Ciclo de vida, hooks e gerenciamento do Playwright
├── step-definitions/
│   └── api_steps.js             # Implementações dos passos Gherkin para API
│   └── e2e_steps.js             # Implementações dos passos Gherkin para Interface/UI
├── reports/                     # Relatórios HTML consolidados (ignorado pelo git)
├── target/                      # Relatórios brutos e artefatos intermediários (ignorado pelo git)
├── test-results/                # Evidências e vídeos categorizados por Passed/Failed
├── .gitignore                   # Arquivos e pastas ignorados pelo controle de versão
├── cucumber.js                  # Configurações globais e perfis de execução do Cucumber
├── playwright.config.js         # Configurações globais do motor Playwright
├── package.json                 # Dependências, scripts de API, E2E e esteira
└── README.md                    # Documentação oficial do projeto
```

## 🛠️ Versões Utilizadas
**Node.js:** v20.17.0.x (LTS)

**Playwright:** ^1.40.0.x

**Cucumber.js:** ^9.6.0x

**Express:** ^5.3.0x (para o Mock de API)

**Start-server-and-test:** "^2.1.5x (Para iniciar o servidor Express e finalizar)

**Gerenciador de Pacotes:** npm

## 📦 Dependências & Instalação
Para clonar e configurar o ambiente de desenvolvimento localmente, siga os passos abaixo:

**1. Pré-requisito:** Certifique-se de ter o Node.js (v20+) instalado na sua máquina.

**2. Clone o repositório:**
```text
git clone <url-do-seu-repositorio>
cd <nome-do-repositorio>
```
**3. Instale as dependências do projeto:**
```text
npm ci
```
**4. Instale os binários dos navegadores do Playwright:**
```text
npx playwright install --with-deps
```
## ⚡ Como Executar os Testes
Os testes são totalmente modularizados para rodar de forma isolada e performática:

**1. Testes de API**
**Sobe o servidor mock em Express na porta 3000 e executa exclusivamente os cenários tagueados com @api, gerando o relatório correspondente:**
```text
npm run test:api
```
**2. Testes E2E (Interface)**
**Executa a suíte de ponta a ponta simulando interações de usuário no browser via Playwright (modo headless) e organiza os vídeos de evidência por status (Passed/Failed):**
```text
npm run test:e2e
```
**3. Execução em Sequência (Local)**
Se desejar rodar a esteira inteira na sua máquina de forma encadeada:
```text
npm run test:api && npm run test:e2e
```
**4. Execução completa (Local)**
Se desejar rodar a esteira inteira podendo paralelizar e ver os dois resultados em um só report:
```text
npm run test:all
```
## 📊 Relatórios & Evidências
**Relatórios HTML do Cucumber:** Disponíveis nos caminhos reports/api/ e reports/e2e/ após a execução das suítes.

**Evidências Visuais (Vídeos):** Gravados automaticamente pelo Playwright e salvos em test-results/videos/ separados por status e timestamp, facilitando o diagnóstico de falhas.

## ☁️ Integração Contínua (CI/CD)
O projeto conta com uma esteira automatizada configurada via GitHub Actions (.github/workflows/qa-pipeline.yml).

**Gatilhos:** A cada push ou pull_request nas branches **main** e **develop** ou iniciando em Actions > Workflows > QA Pipeline (E2E & API) > Run Workflow .

**Etapas do Pipeline:**

1. Setup de ambiente (ubuntu-latest) com Node.js e cache de dependências.

2. Instalação de drivers e dependências do Playwright.

3. Execução modularizada dos testes de API e E2E.

4. Compactação e upload automático de todos os relatórios e artefatos de vídeo para a aba Actions > Artifacts do GitHub.
