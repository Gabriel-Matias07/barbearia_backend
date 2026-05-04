# API Barbearia

API REST desenvolvida em Node.js com autenticação JWT, segundo fator de autenticação (2FA por email), integração com MongoDB em nuvem, upload de imagens, geração de PDF e testes automatizados com Jest.

## Tecnologias utilizadas

* Node.js
* Express
* MongoDB Atlas
* Mongoose
* JWT (jsonwebtoken)
* bcrypt
* Nodemailer (envio de email para 2FA)
* Cloudinary (upload de imagens)
* Multer
* PDFKit
* Jest + Supertest (testes)
* CORS
* dotenv

---

## Funcionalidades

* Autenticação com email e senha
* Segundo fator de autenticação (código enviado por email)
* CRUD completo de itens
* Upload de imagem para nuvem
* Geração de PDF com lista de itens
* Registro de logs das requisições
* Filtro de logs por data
* Cálculo de distância entre coordenadas geográficas
* Testes automatizados

---

## Instalação

Clone o repositório:

```bash
git clone https://github.com/seu-usuario/barbearia_backend.git
cd barbearia_backend
```

Instale as dependências:

```bash
npm install
```

---

## Configuração do ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
MONGO_URI=sua_string_do_mongodb
JWT_SECRET=segredo
PORT=3000

CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=sua_api_secret

EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app
```

Observações:

* O MongoDB deve ser criado no MongoDB Atlas
* O Cloudinary é usado para upload de imagens
* O EMAIL_PASS deve ser uma senha de aplicativo (não a senha normal)

---

## Como rodar o projeto

```bash
node server.js
```

Servidor disponível em:

```
http://localhost:3000
```

---

## Fluxo de autenticação (2FA)

1. Enviar email e senha:

POST `/logar`

```json
{
  "email": "admin@barbearia.com",
  "senha": "123"
}
```

Resposta:

```json
{
  "mensagem": "Código enviado para o email"
}
```

2. Verificar código:

POST `/verificar-2fa`

```json
{
  "email": "admin@barbearia.com",
  "codigo": 123456
}
```

Resposta:

```json
{
  "token": "seu_token"
}
```

---

## Autenticação nas rotas

Adicionar no header:

```
Authorization: SEU_TOKEN
```

---

## Rotas da API

### Itens

GET `/itens`
Lista todos os itens

POST `/itens`
Cria um item

```json
{
  "nome": "Corte",
  "preco": 30,
  "imagem": "url_opcional"
}
```

PUT `/itens/:id`
Atualiza um item

DELETE `/itens/:id`
Remove um item

GET `/itens/:id`
Busca item por ID

---

### Upload de imagem

POST `/upload`

* Tipo: form-data
* Campo: `imagem` (file)

Resposta:

```json
{
  "url": "link_da_imagem"
}
```

---

### PDF

GET `/itens/pdf`

Gera e baixa um PDF com os itens cadastrados

---

### Logs

GET `/logs?data=YYYY-MM-DD`

Exemplo:

```
/logs?data=2026-05-04
```

---

### Distância entre pontos

GET `/distancia?lat1=...&lon1=...&lat2=...&lon2=...`

Exemplo:

```
/distancia?lat1=-7.2&lon1=-39.4&lat2=-7.3&lon2=-39.5
```

Resposta:

```json
{
  "distancia_km": 12.34
}
```

---

## Testes automatizados

Rodar os testes:

```bash
npm test
```

Os testes cobrem:

* Login
* Proteção por token
* CRUD de itens

---

## Estrutura do projeto

```
├── models/
│   ├── Item.js
│   └── Usuario.js
├── tests/
│   └── app.test.js
├── db.js
├── server.js
├── .env
├── package.json
```

---

## Observações

* Os códigos de 2FA são armazenados em memória (não persistem após reiniciar o servidor)
* Os logs também são mantidos em memória
* O projeto foi desenvolvido com foco didático, priorizando simplicidade e funcionamento dos requisitos

---

## Deploy

A aplicação pode ser hospedada em plataformas como:

* Vercel
* Render
* Railway
