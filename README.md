```
📦 api
┣ 📁 dist                                     // Stands for Distribution
┣ 📁 coverage                                 // What portion of the code did the tests cover
┣ 📁 src                                      // Stands for Source
┃ ┣ 📁 @types/                                // Definition / Redefinition of types of a package
┃ ┃
┃ ┣ 📁 config/                                // Files for configuration of application
┃ ┃ ┗ 📄 auth.ts                              // Configuration for Token Authentication
┃ ┃
┃ ┣ 📁 modules                                // Management of FR (Functional Requirements)
┃ ┃ ┗ 📁 users
┃ ┃   ┣ 📁 dtos                               // Interfaces for DTOS (Data Transfer Object)
┃ ┃   ┃ ┗ 📄 ICreateUserDTO.ts                // DTO for Create a User
┃ ┃   ┃
┃ ┃   ┣ 📁 infra                              // Management of NFR (Non-Functional Requirements, Technologies that will be used, e.g. `express` and `typeorm`)
┃ ┃   ┃ ┣ 📁 http                             // Management of HTTP protocols
┃ ┃   ┃ ┃ ┣ 📁 routes                         // Routes definition
┃ ┃   ┃ ┃ ┗ 📁 controlers                     // Management of routes
┃ ┃   ┃ ┃
┃ ┃   ┃ ┗ 📁 typeorm                          // Management of database
┃ ┃   ┃   ┣ 📁 entities                       // Classes that represent a table
┃ ┃   ┃   ┗ 📁 repositories                   // Entities Manipulation
┃ ┃   ┃
┃ ┃   ┣ 📁 repositories                       // Interface for `Liskov Substitution Principle`
┃ ┃   ┃ ┣ 📁 fakes                            // Fakes repositories (Used for Unit Testing, since Unit Testing are isolated tests)
┃ ┃   ┃ ┗ 📄 *.spec.ts                        // Unit Testing (Individual units/components of a software are tested)
┃ ┃   ┃
┃ ┃   ┗ 📁 services                           // Management of FR (with Business Rules: Processes to form systems that get things done, e.g. I cannot register a new user if the login has already been registered)
┃ ┃
┃ ┗ 📁 shared                                 // Management of Shared NFR
┃   ┣ 📁 container                            // Automatic injection of `infra` dependencies in `services` (Dependency Inversion, "A Business Rule doesn't need to know about Non-Functional Requirements")
┃   ┃
┃   ┣ 📁 enums
┃   ┃
┃   ┣ 📁 errors                               // Classes for management of errors
┃   ┃
┃   ┗ 📁 infra
┃     ┣ 📁 http
┃     ┃ ┣ 📁 middlewares
┃     ┃ ┃ ┣ 📄 ensureAuthenticated.ts         // Middleware for ensure that user will be logged-in
┃     ┃ ┃ ┗ 📄 handleErros.ts                 // Middleware for catch errors (will be thrown by `thow new Error()`)
┃     ┃ ┃
┃     ┃ ┣ 📁 routes                           // Has the main routes file
┃     ┃ ┃
┃     ┃ ┗ 📄 server.ts                        // Main Server file
┃     ┃
┃     ┗ 📁 typeorm
┃       ┣ 📁 migrations
┃       ┃ ┣ 📄 1599223547CreateUser.ts        // Create User Table
┃       ┃ ┗ 📄 1599226022InsertCPFUser.ts     // Insert a new column named cpf in User table
┃       ┃
┃       ┗ 📄 index.ts                         // File to typeorm start connection with database
┃
┣ 📄 .editorconfig                            // IDE configuration
┣ 📄 .eslintignore                            // Paths/Files to eslint ignore
┣ 📄 .eslint.json                             // Eslint configuration
┣ 📄 jest.config.ts                           // Jest Configuration (Unit Test)
┣ 📄 ormconfig.json                           // Typeorm Configuration
┣ 📄 package.json                             // Information about this package
┣ 📄 prettier.config.js                       // Prettier configuration
┗ 📄 tsconfig.json                            // Typescript configuration
```

# Recuperação de senha

  **RF**

  - [X] O usuário deve poder recuperar sua senha informando o seu login
  - [X] O usuário deve receber um e-mail com instruções de recuperação de senha
  - [X] O usuário deve poder resetar sua senha

  **RNF**

  - [X] Utilizar Ethereal para testar em ambiente de desenvolvimento
  - [X] Utilizar Servidor de e-mail próprio para envio em produção
  - [-] O envio de e-mail deve acontecer em segundo plano (background job)

  **RN**

  - [X] O link enviado por e-mail para resetar senha, deve expirar em 2h
  - [ ] O usuário precisa confirmar a nova senha ao resetar sua senha

# Painel do usuário

  **RF**

  - [X] O usuário deve poder listar todos os usuários cadastrados de um cliente
  - [X] O usuário deve poder cadastrar um novo usuário
  - [X] O usuário deve poder editar um usuário já cadastrado
  - [X] O usuário deve poder pocurar um usuário pelo nome / login

  **RNF**

  - [X] A listagem de usuários deve ser armazenada em cache
  - [ ] Conferir listagem com a TrueConf
  - [ ] Criar usuário na TrueConf

  **RN**

  - [X] Não pode cadastar / alterar para um e-mail que já exista
  - [X] Não pode cadastar / alterar para um login que já exista
  - [ ] O usuário não deve poder inserir / retirar dos grupos que não possua
  - [ ] O usuário não deve poder inserir / retirar das permissões que não possua
  - [ ] O usuário não deve poder inserir / retirar das sustentações que não possua

# Painel de conferência

  **RF**

  - [X] O usuário deve poder listar todos as conferências cadastradas de um cliente
  - [X] O usuário deve poder cadastrar uma nova conferência
  - [x] O usuário deve poder editar uma conferência já cadastrada
  - [ ] O usuário deve ser capaz de agendar grupos, ou relacionar os usuários no momento da criação, por dia da semana para as conferências

  **RNF**

  - [X] A listagem de conferências deve ser armazenada em cache

  **RN**

  - [-] Não deve poder cadastrar para grupos que não possua ou não seja agendada (-1)
  - [x] Pode existir várias conferências com os mesmos dados

# Envio de e-mails das conferências

  **RF**

  - [ ] O usuário deve poder selecionar qualquer usuário que possa participar da conferência
  - [ ] Caso a conferência seja agendada, o usuário deve poder selecionar para qual dia deseja listar os usuários
  - [ ] O usuário deve poder adicionar um assunto ao e-mail
  - [ ] O usuário deve poder adicionar um corpo ao e-mail

  **RNF**

  - [X] Utilizar Ethereal para testar em ambiente de desenvolvimento
  - [X] Utilizar Servidor de e-mail próprio para envio em produção

# Painel de grupo

  **RF**

  - [X] O usuário deve poder listar todos os grupos cadastrados de um cliente
  - [X] O usuário deve poder cadastrar um novo grupo
  - [X] O usuário deve poder editar um grupo já cadastrado
  - [ ] O usuário deve poder selecionar qualquer usuário cadastrado no sistema

  **RNF**

  - [X] A listagem de grupos deve ser armazenada em cache

  **RN**

  - [X] Não pode existir dois grupos com o mesmo nome

# Painel de sustentações

  **RF**

  - [ ] O usuário deve poder listar todas as sustentações que possa visualizar
  - [ ] O usuário deve poder cadastrar uma nova sustentação
  - [ ] O usuário deve poder editar uma sustenatação
  - [ ] O usuário deve poder editar usuário avulsos já adicionados (Nome, Telefone, Email, Processos)
  - [ ] Caso tenha novos usuários, O usuário deve poder editar o assunto e o corpo do email que será enviado

  **RNF**

  - [ ] A listagem de sustentações deve ser armazenada em cache
  - [X] Utilizar Ethereal para testar em ambiente de desenvolvimento
  - [X] Utilizar Servidor de e-mail próprio para envio em produção

  **RN**

  - [ ] O usuário deve selecionar um grupo que ele possua permissão
  - [ ] Não pode agendar uma sustentação para o passado
  - [ ] Não pode existir duas sustentações para o mesmo grupo no mesmo dia
  - [ ] Será criado um token para o usuário avulso criado XXX-XXX-XXX
  - [ ] Editar um usuário avulso não deverá trocar o token do mesmo
  - [ ] O email deve ser enviado apenas aos novos usuários

# Painel de relatório - Chats

  **RF**

  - [ ] O usuário deve ser capaz de selecionar uma data que haja conferência com chat público
  - [ ] O usuário deve ser capaz de selecionar uma conferência com chat público
  - [ ] O usuário deve ser capaz de pegar todo o chat público da conferência selecionada no dia selecionado

  **RNF**

  - [ ] A listagem de conferencia por dia deve ser armazenada em cache

# Painel de relatório - Ações da Conferência

  **RF**

  - [ ] O usuário deve ser capaz de selecionar uma data que haja conferência
  - [ ] O usuário deve ser capaz de selecionar uma conferência
  - [ ] O usuário deve ser capaz de pegar todo o log de ações da conferência selecionada no dia selecionado

  **RNF**

  - [ ] A listagem de conferencia por dia deve ser armazenada em cache
  - [ ] O log de ações deve ser armazenada em cache
