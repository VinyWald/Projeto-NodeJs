# Projeto CRM em Node.js

## Descrição

Este é um sistema de CRM (Customer Relationship Management) desenvolvido em Node.js, projetado para gerenciar clientes, contatos e usuários. A aplicação oferece uma API RESTful para manipulação de dados, com funcionalidades de autenticação via JWT, upload de arquivos e processamento de tarefas em segundo plano com filas Redis.

## Funcionalidades

* **Gerenciamento de Clientes**: CRUD completo para clientes, com filtros e paginação.
* **Gerenciamento de Contatos**: CRUD completo para contatos, associados a clientes específicos.
* **Gerenciamento de Usuários**: CRUD completo para usuários do sistema, com hash de senha.
* **Autenticação**: Sistema de login com tokens JWT para proteger as rotas da aplicação.
* **Upload de Arquivos**: Funcionalidade para upload de arquivos com armazenamento em disco.
* **Filas com Redis**: Utilização de `bee-queue` e Redis para processar tarefas em segundo plano, como o envio de e-mails de boas-vindas.
* **Envio de E-mails**: Configuração para envio de e-mails transacionais utilizando Nodemailer.
* **Monitoramento de Erros**: Integração com Sentry para monitoramento e rastreamento de erros em tempo real.
* **Validação de Dados**: Utilização do Yup para validar os dados de entrada nas rotas.

## Tecnologias Utilizadas

* **Backend**: Node.js, Express
* **Banco de Dados**: PostgreSQL com Sequelize ORM
* **Filas**: Bee-Queue, Redis
* **Autenticação**: JSON Web Token (JWT), Bcryptjs
* **Upload**: Multer
* **Transpilação**: Sucrase
* **Ferramentas de Desenvolvimento**: Nodemon, Sequelize-CLI

## Instalação e Uso

### Pré-requisitos

* Node.js (v14 ou superior)
* Yarn ou npm
* PostgreSQL
* Redis
* Um cliente de API (como Insomnia, Postman, etc.)

### Passos

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd <NOME_DA_PASTA>
    ```

2.  **Instale as dependências:**
    ```bash
    yarn install
    ```

3.  **Configure as variáveis de ambiente:**
    * Crie um arquivo `.env` na raiz do projeto, utilizando o `.env.example` como referência, e preencha com as suas credenciais para o banco de dados, Redis, e-mail e Sentry.

4.  **Execute as migrations do banco de dados:**
    ```bash
    yarn sequelize db:migrate
    ```

5.  **Inicie o servidor de desenvolvimento:**
    * O servidor principal será iniciado na porta definida no seu arquivo `.env`.
    ```bash
    yarn dev
    ```

6.  **Inicie o processador de filas:**
    * Este comando inicia um processo separado para consumir e processar os jobs da fila.
    ```bash
    yarn queue
    ```

A API estará pronta para receber requisições. Utilize um cliente de API para interagir com os endpoints definidos em `src/routes.js`.
