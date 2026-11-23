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
│       └── index_dev.html           # Aplicação frontend local para testes E2E feita em HTML + JavaScript simulando ambiente DEV
│       └── index_prod.html          # Aplicação frontend local para testes E2E feita em HTML + JavaScript simulando ambiente PROD
│       └── index_staging.html       # Aplicação frontend local para testes E2E feita em HTML + JavaScript simulando ambiente STAGING
├── config/
│   └── .env.dev                 # Arquivo de configuração apontando para o ambiente DEV
│   └── .env.prod                # Arquivo de configuração apontando para o ambiente PROD
│   └── .env.staging             # Arquivo de configuração apontando para o ambiente STAGING
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
│   └── endpoints.js             # Scripts com os endpoints usados
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

**Playwright:** ^1.40.x

**Cucumber.js:** ^9.6.x

**Express:** ^5.3.x (para o Mock de API)

**Start-server-and-test:** "^2.x (Para iniciar o servidor Express e finalizar)

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
**5. Caso necessite checar o acesso ao frontend local de forma manual utilize as seguintes credenciais:**
```text
Usuário: admin_qa
Senha: senha123
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

## 💡Respostas das perguntas e alterações
**Pergunta 1. Vi que a URL está mapeada diretamente, como seria se tivessesmos diferentes ambientes para rodar? Como ficaria esta estrutura e como seria executado para diferentes ambientes? Consegue fazer um ex para mais de um ambiente.**

**Resposta 1: Crei 3 ambientes locais do projeto distintos na pasta ./app/e2e: index_dev.html, index_prod.html e index_staging.html.
Para apontar corretamente é necessário trabalhar com configurações de ambientes, logo criei as dotenvs dentro de ./config com os nomes: .env.dev, .env.prod e .env.staging.
Também alterei os scripts world.js e playwright.config.js para capturar o comando passado no console, conforme modificações presente no último commit.**

**Como executar os múltiplos ambientes:**
**1. Instale a lib do dotenv:**
```text
npm install --save-dev dotenv   
```

**2. Para executar em ambiente de DEV:**
```text
$env:ENV="dev"; npm test:e2e      
```

**3. Para executar em ambiente de STAGING:**
```text
$env:ENV="staging"; npm test:e2e      
```

**4. Para executar em ambiente de PROD:**
```text
$env:ENV="prod"; npm test:e2e      
```

**Pergunta 2. Vi os nomes mapeados diretos na feature, como seria se fosse usar dados dinamicos? Consegue colocar um ex?**

**Resposta 2: Adicionei a biblioteca faker para gerar os dados dinâmicos/aleatórios com a tag @tarefa1_fake (é possível criar o script manualmente, mas não quis reinventar a roda) com essa lib criei um novo cenário com a tag @tarefa1_fake em ui_tests.feature, adicionei a função preencherFormularioPerfilFake recebendo o parâmetro da instância do faker dentro da classe DashboardPage com os campos preenchidos com dados aleatórios e também adicionei a função 'preencho o formulário de cadastro com dados aleatórios válidos' em e2e_steps.js.
Desta forma é possível gerar dados aleatórios/dinâmicos nos campos.**

**Como executar os testes com dados dinâmicos/aleatórios:**
**1. Instale a lib do faker:**
```text
npm install --save-dev @faker-js/faker   
```

**2. Para executar os cenários incluindo o adicionado (rodará em DEV nesse caso que está sem o parâmetro de ambiente):**
```text
npm run test:e2e 
```

**Pergunta 3. Caso eu precise ajustar as rotas do endpoint, faz sentido deixar todas mapeadas em arquivo de feature pra organizar/mapear?**

**Resposta 3: O ideal é ter um arquivo com os endpoints e alterá-los diretamente nele, para não ter que alterar na mão um por um dentro da feature, por isso criei dentro de ./support o script endpoint.js com os endpoints da API usados (menos o PRODUCTS que coloquei só de amostra mesmo, pois esse eu não implementei no server.js) alterei o api_steps.js para receber o módulo do ENDPOINTS, seus valores internos e alterei as funções de step definitions para aceitar os endpoints passados e alterei o api_tests.feature com os novos passos do step definitions para não receber parâmetros estáticos e sim apontar para o que estiver definido no passo.**

**Como executar os testes de api agora apontando para os endpoints em endpoint.js**
**1. Execute os cenários de api:**
```text
npm run test:api   
```
**Todas as alterações foram testadas e passaram no CI/CD do Github Actions, qualquer dúvida sobre as alterações checar o último commit 45590d2**
