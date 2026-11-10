# language: pt
@e2e
Funcionalidade: Validação das Tarefas 1 e 2 - E2E com Playwright e Cucumber

  Contexto:
    Dado que o usuário acessa a página da aplicação web

  @tarefa1 @positivo
  Cenário: Realizar login com sucesso, navegar para o painel e preencher o formulário válido (Tarefa 1)
    Quando eu preencho o login com usuário "admin_qa" e senha "senha123"
    E clico no botão de entrar
    Então devo visualizar o painel de boas-vindas com o usuário "admin_qa"
    E preencho o formulário de cadastro com dados válidos:
      | name  | João da Silva           |
      | email | joao.silva@email.com    |
      | phone | 11988887777             |
      | dob   | 1990-05-15              |
      | job   | Engenheiro de QA        |
      | dept  | qa                      |
      | city  | Osasco                  |
      | state | SP                      |
    E clico em salvar informações completa
    Então devo ver a mensagem de sucesso do modal "Sucesso!"

  @tarefa1 @negativo
  Esquema do Cenário: Validar cenários negativos de login e formulário (Tarefa 1)
    Quando eu preencho o login com usuário "<usuario>" e senha "<senha>"
    E clico no botão de entrar
    Então devo ver a mensagem de erro do modal "<mensagemErro>"

    Exemplos:
      | usuario   | senha     | mensagemErro           |
      |           |           | Campos em Branco       |
      | erradoman | senha123  | Falha na Autenticação  |

  @tarefa2 @positivo
  Cenário: Realizar fluxo completo de e-commerce e checkout com sucesso (Tarefa 2)
    Quando eu preencho o login com usuário "admin_qa" e senha "senha123"
    E clico no botão de entrar
    E navego para a seção de e-commerce
    E adiciono o produto "Teclado Mecânico RGB" ao carrinho
    E preencho o endereço de entrega "Rua dos Testes, 123 - Osasco/SP"
    E preencho o número do cartão "4111 2222 3333 4444"
    E clico em finalizar compra
    Então devo ver a mensagem de sucesso do modal "Compra Concluída!"

  @tarefa2 @negativo
  Esquema do Cenário: Validar cenários negativos de checkout com cartão inválido ou carrinho vazio (Tarefa 2)
    Quando eu preencho o login com usuário "admin_qa" e senha "senha123"
    E clico no botão de entrar
    E navego para a seção de e-commerce
    E preencho o endereço de entrega "Rua dos Testes, 123"
    E preencho o número do cartão "<cartao>"
    E clico em finalizar compra
    Então devo ver a mensagem de erro do modal "<mensagemErro>"

    Exemplos:
      | cartao            | mensagemErro       |
      | 0000 0000 0000    | Carrinho Vazio     |