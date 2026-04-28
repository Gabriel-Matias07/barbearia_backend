require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const PDFDocument = require('pdfkit');

const conectarDB = require('./db');
const Usuario = require('./models/Usuario');
const Item = require('./models/Item');

const app = express();
app.use(express.json());

conectarDB();

const PORT = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET;

let logs = [];

// HTML
app.get('/', (req, res) => {
  res.send("API rodando");
});

// MIDDLEWARE dias úteis
function apenasDiasUteis(req, res, next) {
  const dia = new Date().getDay();

  if (dia === 5) {
    return res.status(403).json({ erro: "API só funciona de segunda a sexta" });
  }

  next();
}

// LOGS
function registrarLog(req, res, next) {
  logs.push({
    rota: req.path,
    data: new Date().toISOString()
  });

  next();
}

app.use(apenasDiasUteis);
app.use(registrarLog);

// AUTH
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

// LOGIN
app.post('/logar', async (req, res) => {
  const { email, senha } = req.body;

  const user = await Usuario.findOne({ email });

  if (!user) {
    return res.status(401).json({ erro: "Credenciais inválidas" });
  }

  const senhaValida = await bcrypt.compare(senha, user.senha);

  if (!senhaValida) {
    return res.status(401).json({ erro: "Credenciais inválidas" });
  }

  const token = jwt.sign({ id: user._id }, SECRET);

  res.json({ token });
});

// PDF
app.get('/itens/pdf', autenticar, async (req, res) => {
  const itens = await Item.find();

  const doc = new PDFDocument();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=itens.pdf');

  doc.pipe(res);

  doc.fontSize(18).text('Lista de Serviços', { align: 'center' });
  doc.moveDown();

  itens.forEach(i => {
    doc.fontSize(12).text(`${i._id} - ${i.nome} - R$${i.preco}`);
  });

  doc.end();
});

// GET itens
app.get('/itens', autenticar, async (req, res) => {
  const itens = await Item.find();
  res.json(itens);
});

// POST item
app.post('/itens', autenticar, async (req, res) => {
  const { nome, preco } = req.body;

  const novo = await Item.create({ nome, preco });

  res.json(novo);
});

// DELETE item
app.delete('/itens/:id', autenticar, async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ mensagem: "Item removido" });
});

// GET item por ID
app.get('/itens/:id', autenticar, async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    return res.status(404).json({ erro: "Item não encontrado" });
  }

  res.json(item);
});

// LOGS
app.get('/logs', autenticar, (req, res) => {
  const { data } = req.query;

  const filtrados = logs.filter(l => l.data.startsWith(data));

  res.json(filtrados);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});