const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;  
const SECRET = "segredo";


app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <title>API Barbearia</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: linear-gradient(135deg, #1e1e2f, #2c2c54);
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }

        .container {
          text-align: center;
        }

        img {
          width: 700px;
          border-radius: 10px;
          margin-bottom: 15px;
        }

        footer {
          font-size: 30px;
          color: #ccc;
        }
      </style>
    </head>
    <body>

      <div class="container">
        <img src="https://http.cat/200">
        <footer>A rota / está ativa, mas não tem interface visual aqui</footer>
      </div>

    </body>
    </html>
  `);
});

let usuarios = [
  { id: 1, email: "admin@barbearia.com", senha: "123" }
];

let itens = [
  { id: 1, nome: "Corte de cabelo", preco: 30 },
  { id: 2, nome: "Barba", preco: 20 }
];

let logs = [];

// MIDDLEWARE dos dias úteis

function apenasDiasUteis(req, res, next) {
  const dia = new Date().getDay();

  if (dia === 5 ) {
    return res.status(403).json({ erro: "API só funciona de segunda a sexta" });
  }

  next();
}

// MIDDLEWARE: logs
function registrarLog(req, res, next) {
  logs.push({
    rota: req.path,
    data: new Date().toISOString()
  });

  next();
}

app.use(apenasDiasUteis);
app.use(registrarLog);


// MIDDLEWARE: autenticacao

function autenticar(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ erro: "Token não enviado" });
  }

  try {
    jwt.verify(token, SECRET);
    next();
  } catch {
    return res.status(401).json({ erro: "Token inválido" });
  }
}

// A. LOGIN

app.post('/logar', (req, res) => {
  const { email, senha } = req.body;

  const user = usuarios.find(u => u.email === email && u.senha === senha);

  if (!user) {
    return res.status(401).json({ erro: "Credenciais inválidas" });
  }

  const token = jwt.sign({ id: user.id }, SECRET);

  res.json({ token });
});

const PDFDocument = require('pdfkit');
  

//Rota de gerar PDP
app.get('/itens/pdf', autenticar, (req, res) => {
  const doc = new PDFDocument();

  // Configura o download
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=itens.pdf');

  // Liga o PDF na resposta
  doc.pipe(res);

  // Título
  doc.fontSize(18).text('Lista de Serviços', {
    align: 'center'
  });

  doc.moveDown();

  // Lista de itens
  itens.forEach(i => {
    doc.fontSize(12).text(`${i.id} - ${i.nome} - R$${i.preco}`);
  });

  // Finaliza o PDF
  doc.end();
});

// B. LISTAR ITENS

app.get('/itens', autenticar, (req, res) => {
  res.json(itens);
});

// C. CRIAR ITEM

app.post('/itens', autenticar, (req, res) => {
  const { nome, preco } = req.body;

  const novo = {
    id: itens.length + 1,
    nome,
    preco
  };

  itens.push(novo);

  res.json(novo);
});

// D. DELETAR ITEM

app.delete('/itens/:id', autenticar, (req, res) => {
  const id = parseInt(req.params.id);

  itens = itens.filter(i => i.id !== id);

  res.json({ mensagem: "Item removido" });
});

// F. BUSCAR POR ID

app.get('/itens/:id', autenticar, (req, res) => {
  const id = parseInt(req.params.id);

  const item = itens.find(i => i.id === id);

  if (!item) {
    return res.status(404).json({ erro: "Item não encontrado" });
  }

  res.json(item);
});

// F. LOGS POR DATA
app.get('/logs', autenticar, (req, res) => {
  const { data } = req.query;

  const filtrados = logs.filter(l => l.data.startsWith(data));

  res.json(filtrados);
});


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});