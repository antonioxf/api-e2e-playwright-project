# language: pt
@api
Funcionalidade: Testes Automatizados de API - CRUD Completo e Validações

  Contexto:
    Dado que o cliente da API está configurado com a base URL de testes

  @api_get @positivo
  Cenário: Validar listagem de usuários com sucesso (GET)
    Quando eu envio uma requisição GET para o endpoint "/api/users"
    Então o status code da resposta deve ser 200
    E o corpo da resposta deve conter uma lista de usuários válida

  @api_post @positivo
  Cenário: Criar um novo usuário com sucesso (POST)
    Quando eu envio uma requisição POST para o endpoint "/api/users" com os dados:
      | name  | job     |
      | Jão   | QA Lead |
    Então o status code da resposta deve ser 201
    E o corpo da resposta deve retornar o ID gerado e os dados cadastrados

  @api_post @negativo
  Cenário: Tentar criar usuário com payload malformado ou dados ausentes (POST Negativo)
    Quando eu envio uma requisição POST para o endpoint "/api/users" com dados vazios
    Então o status code da resposta deve ser 400

  @api_put @positivo
  Cenário: Atualizar dados de um usuário existente (PUT)
    Quando eu envio uma requisição PUT para o endpoint "/api/users/2" com os dados:
      | name       | job            |
      | Jão Senior | Senior QA Eng  |
    Então o status code da resposta deve ser 200
    E o corpo da resposta deve refletir os dados atualizados

  @api_delete @positivo
  Cenário: Deletar um usuário existente (DELETE)
    Quando eu envio uma requisição DELETE para o endpoint "/api/users/2"
    Então o status code da resposta deve ser 204