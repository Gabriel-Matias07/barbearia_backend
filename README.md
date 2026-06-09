# Barbearia Backend

API REST para gerenciamento de serviços de uma barbearia, com autenticação, exportação de dados, backup em CSV, relatório de monitoramento, streaming de vídeo e integração em tempo real com sensor DHT22 simulado no Wokwi usando ESP32.

O projeto foi desenvolvido em Node.js com Express e MongoDB, utilizando uma estrutura simples, organizada por rotas e serviços para facilitar manutenção, leitura do código e apresentação técnica.

---

## Funcionalidades principais

- Autenticação com e-mail, senha criptografada e validação em duas etapas.
- Cadastro, listagem, atualização e remoção de serviços da barbearia.
- Upload de imagem para Cloudinary.
- Exportação dos serviços cadastrados em formato CSV.
- Backup automático diário dos dados em CSV.
- Backup manual para demonstração e validação.
- Relatório de monitoramento em PDF.
- Registro de acessos às rotas da API.
- Stream de vídeo institucional.
- Comunicação em tempo real com Socket.IO.
- Recebimento de dados de sensor DHT22 via ESP32 simulado no Wokwi.
- Painel web simples para visualização das funcionalidades.

---

## Tecnologias utilizadas

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JWT
- bcrypt
- Nodemailer
- Cloudinary
- Multer
- PDFKit
- json2csv
- node-cron
- Socket.IO
- Jest
- Supertest
- Wokwi
- ESP32
- DHT22

---

## Estrutura do projeto

```txt
barbearia_backend/
├── backups/
│   └── .gitkeep
├── models/
│   ├── Item.js
│   └── Usuario.js
├── public/
│   ├── index.html
│   └── videos/
│       └── video.mp4
├── routes/
│   ├── backupRoutes.js
│   ├── exportacaoRoutes.js
│   ├── monitoramentoRoutes.js
│   ├── sensorRoutes.js
│   └── videoRoutes.js
├── services/
│   ├── backupService.js
│   ├── csvService.js
│   ├── monitoramentoService.js
│   └── sensorService.js
├── tests/
│   └── app.test.js
├── uploads/
├── criarUsuario.js
├── db.js
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

---

## Descrição da estrutura

### `server.js`

Arquivo principal da aplicação.

Responsável por:

- carregar variáveis de ambiente;
- configurar o Express;
- conectar ao MongoDB;
- configurar CORS;
- configurar Cloudinary;
- configurar Multer;
- configurar envio de e-mail;
- iniciar o servidor HTTP;
- configurar Socket.IO;
- registrar middlewares;
- registrar rotas separadas;
- iniciar o backup automático com `node-cron`.

---

### `models/`

Contém os modelos do MongoDB usados pelo Mongoose.

#### `models/Item.js`

Modelo dos serviços/itens da barbearia.

Campos principais:

```txt
nome
preco
imagem
```

#### `models/Usuario.js`

Modelo de usuário usado na autenticação.

Campos principais:

```txt
email
senha
```

A senha é armazenada criptografada com bcrypt.

---

### `routes/`

Contém as rotas separadas da aplicação.

#### `routes/exportacaoRoutes.js`

Contém a rota:

```txt
GET /exportar
```

Essa rota exporta os serviços cadastrados no banco em formato CSV.

---

#### `routes/backupRoutes.js`

Contém a rota:

```txt
GET /backup/manual
```

Essa rota gera manualmente um backup CSV dos dados no servidor.

Ela foi criada para facilitar teste, validação e demonstração da funcionalidade.

---

#### `routes/monitoramentoRoutes.js`

Contém as rotas:

```txt
GET /relatorio-monitoramento
GET /monitoramento/acessos
```

A primeira gera um PDF com os acessos do mês atual.

A segunda retorna os acessos em JSON, útil para conferência e validação técnica.

---

#### `routes/videoRoutes.js`

Contém a rota:

```txt
GET /video
```

Essa rota faz o streaming de um arquivo MP4 salvo em:

```txt
public/videos/video.mp4
```

O vídeo é entregue em partes usando `Range`, permitindo que o navegador reproduza sem precisar baixar tudo antes.

---

#### `routes/sensorRoutes.js`

Contém as rotas:

```txt
POST /sensor
GET /sensor/ultima-leitura
```

A rota `POST /sensor` recebe dados enviados pelo ESP32 simulado no Wokwi.

A rota `GET /sensor/ultima-leitura` retorna a última leitura recebida.

---

### `services/`

Contém regras de negócio e funções auxiliares separadas das rotas.

#### `services/csvService.js`

Responsável por buscar os itens no MongoDB e converter os dados para CSV.

---

#### `services/backupService.js`

Responsável por gerar o backup dos itens em CSV e salvar o arquivo na pasta `backups/`.

---

#### `services/monitoramentoService.js`

Responsável por:

- registrar acessos às rotas;
- filtrar acessos do mês atual;
- contar acessos por rota;
- identificar horário de pico;
- fornecer os dados usados no relatório PDF.

---

#### `services/sensorService.js`

Responsável por:

- registrar a última leitura recebida do sensor;
- guardar os dados em memória;
- configurar o Socket.IO para enviar dados ao painel em tempo real.

---

### `public/`

Contém arquivos públicos usados pela aplicação.

#### `public/index.html`

Painel web da barbearia.

Acessível pela rota:

```txt
GET /painel
```

O painel exibe:

- botões administrativos;
- exportação CSV;
- backup manual;
- relatório de monitoramento;
- histórico de acessos;
- última leitura do sensor;
- vídeo institucional;
- dados do sensor em tempo real.

---

#### `public/videos/video.mp4`

Arquivo de vídeo usado na rota de streaming.

---

### `backups/`

Pasta onde os backups CSV são gerados.

Os arquivos `.csv` gerados nessa pasta são ignorados pelo Git.

O arquivo `.gitkeep` existe apenas para manter a pasta versionada no repositório.

---

## Configuração do ambiente

Crie um arquivo `.env` na raiz do projeto com as variáveis abaixo:

```env
MONGO_URI=sua_string_de_conexao_mongodb
JWT_SECRET=sua_chave_secreta_jwt

EMAIL_USER=seu_email
EMAIL_PASS=sua_senha_de_app

CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=sua_api_secret
```

O arquivo `.env` não deve ser enviado para o GitHub.

---

## Instalação

Clone o repositório:

```bash
git clone https://github.com/Gabriel-Matias07/barbearia_backend.git
```

Entre na pasta do projeto:

```bash
cd barbearia_backend
```

Entre na branch de desenvolvimento:

```bash
git checkout develop
```

Instale as dependências:

```bash
npm install
```

Crie e configure o arquivo `.env`.

Depois rode os testes:

```bash
npm test
```

Inicie o servidor:

```bash
npm start
```

Ou:

```bash
node server.js
```

Servidor local:

```txt
http://localhost:3000
```

Painel local:

```txt
http://localhost:3000/painel
```

---

## Scripts disponíveis

```bash
npm start
```

Inicia a aplicação com:

```bash
node server.js
```

```bash
npm test
```

Executa os testes automatizados com Jest e Supertest.

---

## Rotas principais

### Home

```txt
GET /
```

Retorna uma mensagem indicando que a API está no ar.

---

### Painel

```txt
GET /painel
```

Abre a interface web do sistema.

---

### Autenticação

```txt
POST /logar
```

Recebe e-mail e senha, valida as credenciais e envia um código 2FA.

Exemplo de corpo:

```json
{
  "email": "admin@barbearia.com",
  "senha": "123"
}
```

---

```txt
POST /verificar-2fa
```

Valida o código 2FA e retorna um token JWT.

Exemplo de corpo:

```json
{
  "email": "admin@barbearia.com",
  "codigo": 123456
}
```

---

### Itens

As rotas de itens exigem token JWT no cabeçalho:

```txt
Authorization: TOKEN
```

Listar itens:

```txt
GET /itens
```

Criar item:

```txt
POST /itens
```

Exemplo:

```json
{
  "nome": "Corte Degradê",
  "preco": 30,
  "imagem": "https://exemplo.com/imagem.jpg"
}
```

Atualizar item:

```txt
PUT /itens/:id
```

Buscar item por ID:

```txt
GET /itens/:id
```

Deletar item:

```txt
DELETE /itens/:id
```

---

### Upload de imagem

```txt
POST /upload
```

Recebe uma imagem via `multipart/form-data`, envia para o Cloudinary e retorna a URL da imagem.

Essa URL pode ser salva no campo `imagem` de um item.

---

### Exportação CSV

```txt
GET /exportar
```

Exporta os itens cadastrados no MongoDB em formato CSV.

O arquivo gerado contém os campos:

```txt
id
nome
preco
imagem
```

Exemplo de saída:

```csv
"id","nome","preco","imagem"
"69f134303b1b41fdbf357d4e","Corte Degradê",30,"https://exemplo.com/imagem.jpg"
```

---

### Backup manual

```txt
GET /backup/manual
```

Gera um backup CSV manualmente e salva na pasta `backups/` do servidor.

Exemplo de resposta:

```json
{
  "mensagem": "Backup gerado com sucesso no servidor",
  "arquivo": "backup-itens-2026-06-08-17-00-00.csv",
  "caminho": "/app/backups/backup-itens-2026-06-08-17-00-00.csv"
}
```

---

### Backup automático

O sistema executa backup automático todos os dias às 17:00 usando `node-cron`.

Agendamento usado:

```txt
0 17 * * *
```

Interpretação:

```txt
minuto 0
hora 17
todos os dias do mês
todos os meses
todos os dias da semana
```

O backup é salvo em formato CSV dentro da pasta `backups/` do servidor.

---

### Relatório de monitoramento

```txt
GET /relatorio-monitoramento
```

Gera um PDF contendo:

- total de acessos no mês atual;
- quantidade de acessos por rota;
- horário de pico de uso do sistema.

---

### Histórico de acessos

```txt
GET /monitoramento/acessos
```

Retorna os acessos registrados em formato JSON.

Exemplo:

```json
[
  {
    "metodo": "GET",
    "rota": "/painel",
    "data": "2026-06-08T20:00:00.000Z",
    "hora": 17
  }
]
```

---

### Stream de vídeo

```txt
GET /video
```

Faz streaming do arquivo:

```txt
public/videos/video.mp4
```

O streaming usa leitura parcial do arquivo com `Range`, permitindo reprodução no navegador.

---

### Sensor

```txt
POST /sensor
```

Recebe dados do sensor enviado pelo ESP32 no Wokwi.

Exemplo de corpo:

```json
{
  "temperatura": 26.5,
  "umidade": 64.2,
  "sensor": "DHT22",
  "origem": "ESP32 Wokwi"
}
```

Exemplo de resposta:

```json
{
  "mensagem": "Leitura recebida com sucesso",
  "leitura": {
    "temperatura": 26.5,
    "umidade": 64.2,
    "sensor": "DHT22",
    "origem": "ESP32 Wokwi",
    "data": "2026-06-08T20:00:00.000Z",
    "horario": "17:00:00"
  }
}
```

---

```txt
GET /sensor/ultima-leitura
```

Retorna a última leitura recebida do sensor.

---

## Comunicação em tempo real

O sistema usa Socket.IO para atualizar o painel em tempo real.

Fluxo:

```txt
ESP32 envia POST /sensor
↓
API recebe os dados
↓
sensorService registra a leitura
↓
Socket.IO emite o evento "sensor"
↓
Painel recebe o evento
↓
Tela atualiza sem recarregar
```

Evento emitido:

```txt
sensor
```

Exemplo de dado enviado pelo socket:

```json
{
  "temperatura": 26.5,
  "umidade": 64.2,
  "sensor": "DHT22",
  "origem": "ESP32 Wokwi",
  "data": "2026-06-08T20:00:00.000Z",
  "horario": "17:00:00"
}
```

---

## Integração com Wokwi, ESP32 e DHT22

A integração com sensor foi feita usando o Wokwi, um simulador online de eletrônica.

Componentes usados:

```txt
ESP32
DHT22
```

O DHT22 é um sensor de temperatura e umidade.

A ESP32 lê os dados do DHT22 e envia as informações via HTTP POST para a API hospedada no Render.

---

## Ligações do circuito

Considerando o DHT22 visto de frente, os pinos são:

```txt
1º pino → VCC
2º pino → DATA/SDA
3º pino → NC
4º pino → GND
```

Ligações usadas:

```txt
DHT22 VCC  → ESP32 3V3
DHT22 DATA → ESP32 GPIO 15
DHT22 NC   → não conectado
DHT22 GND  → ESP32 GND
```

---

## Explicação das ligações

### VCC

O pino VCC alimenta o sensor.

No projeto, ele foi conectado ao pino `3V3` da ESP32.

---

### GND

O GND fecha a referência elétrica entre o sensor e a placa.

Sem o GND comum, o sensor e a ESP32 não teriam a mesma referência de tensão.

---

### DATA/SDA

O pino DATA é o canal de comunicação do sensor.

É por ele que o DHT22 envia os dados de temperatura e umidade para a ESP32.

No projeto, ele foi conectado ao `GPIO 15`.

---

### NC

NC significa `Not Connected`.

Esse pino não é usado.

---

## Código do ESP32 no Wokwi

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include "DHTesp.h"

const char* ssid = "Wokwi-GUEST";
const char* password = "";

const char* serverUrl = "https://barbearia-backend-o5px.onrender.com/sensor";

const int DHT_PIN = 15;

DHTesp dhtSensor;

void conectarWiFi() {
  Serial.print("Conectando ao WiFi");

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("WiFi conectado");
  Serial.print("IP local: ");
  Serial.println(WiFi.localIP());
}

void enviarDadosParaAPI(float temperatura, float umidade) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi desconectado. Tentando reconectar...");
    conectarWiFi();
  }

  WiFiClientSecure client;
  client.setInsecure();

  HTTPClient http;

  http.begin(client, serverUrl);
  http.addHeader("Content-Type", "application/json");

  String json = "{";
  json += "\"temperatura\":" + String(temperatura, 1) + ",";
  json += "\"umidade\":" + String(umidade, 1) + ",";
  json += "\"sensor\":\"DHT22\",";
  json += "\"origem\":\"ESP32 Wokwi\"";
  json += "}";

  Serial.println("Enviando leitura para a API:");
  Serial.println(json);

  int codigoResposta = http.POST(json);

  Serial.print("Código HTTP: ");
  Serial.println(codigoResposta);

  if (codigoResposta > 0) {
    String resposta = http.getString();
    Serial.println("Resposta da API:");
    Serial.println(resposta);
  } else {
    Serial.println("Falha ao enviar requisição para a API.");
  }

  http.end();
}

void setup() {
  Serial.begin(115200);

  dhtSensor.setup(DHT_PIN, DHTesp::DHT22);

  conectarWiFi();

  Serial.println("Sistema iniciado. Lendo sensor DHT22...");
}

void loop() {
  TempAndHumidity dados = dhtSensor.getTempAndHumidity();

  if (isnan(dados.temperature) || isnan(dados.humidity)) {
    Serial.println("Falha ao ler o sensor DHT22.");
    delay(5000);
    return;
  }

  Serial.println("------------------------------");
  Serial.print("Temperatura: ");
  Serial.print(dados.temperature, 1);
  Serial.println(" °C");

  Serial.print("Umidade: ");
  Serial.print(dados.humidity, 1);
  Serial.println(" %");

  enviarDadosParaAPI(
    dados.temperature,
    dados.humidity
  );

  delay(5000);
}
```

---

## Biblioteca usada no Wokwi

No arquivo `libraries.txt` do Wokwi, adicionar:

```txt
DHT sensor library for ESPx
```

---

## Deploy

A aplicação foi hospedada no Render.

URL da API:

```txt
https://barbearia-backend-o5px.onrender.com
```

Painel:

```txt
https://barbearia-backend-o5px.onrender.com/painel
```

Endpoint do sensor:

```txt
https://barbearia-backend-o5px.onrender.com/sensor
```

---

## Testes manuais

### Testar sensor local com Bash

```bash
curl -X POST http://localhost:3000/sensor \
  -H "Content-Type: application/json" \
  -d '{"temperatura":26.5,"umidade":64.2,"sensor":"DHT22","origem":"Teste manual"}'
```

---

### Testar sensor no Render com Bash

```bash
curl -X POST https://barbearia-backend-o5px.onrender.com/sensor \
  -H "Content-Type: application/json" \
  -d '{"temperatura":26.5,"umidade":64.2,"sensor":"DHT22","origem":"Teste Render"}'
```

---

### Testar sensor no Render com PowerShell

```powershell
curl.exe -X POST "https://barbearia-backend-o5px.onrender.com/sensor" -H "Content-Type: application/json" -d '{ "temperatura": 26.5, "umidade": 64.2, "sensor": "DHT22", "origem": "Teste Render" }'
```

---

## Testes automatizados

Para executar os testes:

```bash
npm test
```

Os testes validam rotas principais da API, incluindo autenticação e CRUD de itens.

---

## Observações técnicas

### Sobre os backups

Os backups CSV são gerados na pasta `backups/`.

Em ambiente local, essa pasta fica dentro do projeto.

Em ambiente hospedado, ela representa a pasta no servidor onde a aplicação está rodando.

Para uma versão de produção, seria recomendado salvar os backups em armazenamento externo persistente, como S3, Google Drive, Cloudinary ou outro serviço de nuvem.

---

### Sobre monitoramento

Os acessos são armazenados em memória.

Isso é suficiente para demonstração e validação da lógica.

Em uma versão de produção, esses dados deveriam ser persistidos no MongoDB para não serem perdidos quando o servidor reiniciar.

---

### Sobre o sensor

A leitura do sensor também é mantida em memória.

A API armazena apenas a última leitura recebida.

Em uma evolução futura, seria possível criar uma coleção no MongoDB para armazenar o histórico completo das leituras.

---

### Sobre Socket.IO

O Socket.IO é usado para atualizar o painel em tempo real.

Quando uma nova leitura chega em `POST /sensor`, o backend emite o evento `sensor` para todos os clientes conectados.

---

### Sobre Vercel

O projeto foi hospedado no Render porque o backend usa servidor Node.js contínuo, Socket.IO, rotina agendada e armazenamento local de backup.

Essas características não combinam bem com uma arquitetura serverless simples.

---

## Próximas melhorias possíveis

- Separar também as rotas de login, upload, itens e distância.
- Criar controllers para reduzir lógica nas rotas.
- Persistir os logs de monitoramento no MongoDB.
- Persistir leituras do sensor no MongoDB.
- Salvar backup CSV em nuvem externa.
- Proteger rotas administrativas com autenticação.
- Melhorar validações de entrada.
- Adicionar expiração ao JWT.
- Remover `codigo_debug` em ambiente de produção.
- Criar dashboard com gráficos.
- Criar documentação Swagger/OpenAPI.
- Melhorar tratamento de erros.
- Criar coleção de histórico do sensor.
- Criar paginação para itens.
- Criar filtros no relatório de monitoramento.

---

## Resumo do fluxo principal

```txt
Usuário acessa o painel
↓
Pode exportar CSV
↓
Pode gerar backup
↓
Pode baixar relatório de monitoramento
↓
Pode assistir vídeo institucional
↓
Pode acompanhar sensor em tempo real
```

Fluxo do sensor:

```txt
DHT22 no Wokwi
↓
ESP32 lê temperatura e umidade
↓
ESP32 envia POST para /sensor
↓
API recebe a leitura
↓
Socket.IO envia para o painel
↓
Tela atualiza em tempo real
```

---

## Autor

Projeto acadêmico desenvolvido por Gabriel Pereira e Rayana Gomes
