# barbearia_backend
Projeto acadêmico para criação de um rotas.

````md
# API de Barbearia

API REST simples feita com **Node.js**, **Express** e **JWT** para gerenciar serviços de uma barbearia.

## Funcionalidades

- Login com token JWT
- Listagem, cadastro, busca e remoção de itens
- Consulta de logs por data
- Geração de relatório em texto
- Acesso permitido apenas em dias úteis

## Tecnologias

- Node.js
- Express
- JSON Web Token (JWT)

## Como executar

```bash
npm install
npm install express jsonwebtoken
node index.js
````

Servidor: `http://localhost:3000`

## Rotas

* `POST /logar`
* `GET /itens`
* `POST /itens`
* `GET /itens/:id`
* `DELETE /itens/:id`
* `GET /logs?data=AAAA-MM-DD`
* `GET /itens/pdf`

## Observações

* Usa dados em memória
* Algumas rotas precisam de token no header `Authorization`
* `/itens/pdf` retorna um arquivo `.txt`

## Usuário teste

* **Email:** [admin@barbearia.com](mailto:admin@barbearia.com)
* **Senha:** 123

```
```
