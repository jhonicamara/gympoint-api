<h1 align="center">
	<img alt="MeetUp" src=".github/logo.svg" width="200px" />
</h1>

<h3 align="center">
  <b>Backend Gympoint</b>
</h3>


<p align="center">
  <a href="#-Sobre-o-projeto">Sobre o projeto</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-Tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-Executando-o-projeto">Executando o projeto</a>
</p>


## 💇🏻‍♂️ Sobre o projeto

Esta api entrega o que é necessário para organizar uma academia.

Os usuários no aplicativo podem verificar realizar o checkin, além de possuir um espaço para perguntas e respostas com os alunos.

Os administratores na página web podem cadastrar, editar e deletar usuarios e matriculas, além de possuir um espaço para perguntas e respostas com os alunos.

Veja também o **frontend**, clique aqui: [MeetApp Frontend](https://github.com/jhonicamara/gympoint-web)<br />
Veja também o **mobile**, clique aqui: [MeetApp Mobile](https://github.com/jhonicamara/gympoint-mobile)

## 🚀 Tecnologias

Tecnologias que utilizei para desenvolver esta api

- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/pt-br/)
- [Multer](https://github.com/expressjs/multer)
- [JWT-token](https://jwt.io/)
- [Sequelize](https://sequelize.org/master/)
- [PostgreSQL](https://www.postgresql.org/)
- [Date-fns](https://date-fns.org/)
- [Bee Queue](https://github.com/bee-queue/bee-queue)
- [Nodemailer](https://nodemailer.com/about/)
- [Eslint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [EditorConfig](https://editorconfig.org/)

## 💻 Executando o projeto

Adicione o arquivo `Insomnia.json` no aplicativo Insomnia, para testar as rotas

### Requisitos

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://classic.yarnpkg.com/) ou [npm](https://www.npmjs.com/)
- Um instância do [PostgreSQL](https://www.postgresql.org/)

**Faça o clone do projeto e acesse a pasta**

```bash
$ git clone https://github.com/jhonicamara/gympoint-api.git gympoint-api && cd gympoint-api
```

**Siga os passos a seguir**

```bash
# Instale as dependências
$ yarn

# Crie uma instancia do postgreSQL usando docker
$ docker run --name gympoint-postgres -e POSTGRES_USER=docker \
              -e POSTGRES_DB=gympoint -e POSTGRES_PASSWORD=docker \
              -p 5432:5432 -d postgres

# Copie o arquivo '.env.example' e o renomeie para '.env' depois adicione os valores das variaveis ambiente.
$ cp .env.example .env

# Quando todos serviçoes estiverem rodando, execute as migrations, na pasta do projeto.
$ yarn sequelize db:migrate

# Inicie a api, na pasta do projeto
$ yarn server

# Inicie a fila de envio de emails
$ yarn queue

# Pronto, projeto funcionando!
```
---

Feito por João Câmara 👋 [Veja meu Linkedin](https://www.linkedin.com/in/jo%C3%A3o-c%C3%A2mara-565b42184/)
