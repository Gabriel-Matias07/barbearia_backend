require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const PDFDocument = require('pdfkit');
const cors = require('cors');

const conectarDB = require('./db');
const Usuario = require('./models/Usuario');
const Item = require('./models/Item');

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000'
}));

conectarDB();

const PORT = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET;

let logs = [];

// HOME
app.get('/', (req, res) => {
  res.send("API rodando 🚀");
});

// MIDDLEWARE
function apenasDiasUteis(req, res, next) {
  const dia = new Date().getDay();
  if (false) {
    return res.status(403).json({ erro: "API só funciona de segunda a sexta" });
  }
  next();
}

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

  if (!token) return res.status(401).json({ erro: "Token não enviado" });

  try {
    jwt.verify(token, SECRET);
    next();
  } catch {
    return res.status(401).json({ erro: "Token inválido" });
  }
}

// LOGIN
app.post('/logar', async (req, res) => {
  console.log(req.body); 
  const { email, senha } = req.body;

  const user = await Usuario.findOne({ email });

  if (!user) return res.status(401).json({ erro: "Credenciais inválidas" });

  const senhaValida = await bcrypt.compare(senha, user.senha);

  if (!senhaValida) return res.status(401).json({ erro: "Credenciais inválidas" });

  const token = jwt.sign({ id: user._id }, SECRET);

  res.json({ token });
});

// DISTÂNCIA
function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (deg) => deg * Math.PI / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

app.get('/distancia', (req, res) => {
  const { lat1, lon1, lat2, lon2 } = req.query;

  if (!lat1 || !lon1 || !lat2 || !lon2) {
    return res.status(400).json({ erro: "Parâmetros faltando" });
  }

  const distancia = calcularDistancia(
    Number(lat1),
    Number(lon1),
    Number(lat2),
    Number(lon2)
  );

  res.json({ distancia_km: distancia });
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
    doc.text(`${i._id} - ${i.nome} - R$${i.preco}`);
  });

  doc.end();
});

// CRUD
app.get('/itens', autenticar, async (req, res) => {
  res.json(await Item.find());
});

app.post('/itens', autenticar, async (req, res) => {
  const { nome, preco } = req.body;
  const novo = await Item.create({ nome, preco });
  res.json(novo);
});

app.put('/itens/:id', autenticar, async (req, res) => {
  const { nome, preco } = req.body;

  try {
    const atualizado = await Item.findByIdAndUpdate(
      req.params.id,
      { nome, preco },
      { new: true }
    );

    if (!atualizado) {
      return res.status(404).json({ erro: "Item não encontrado" });
    }

    res.json(atualizado);
  } catch {
    res.status(400).json({ erro: "ID inválido" });
  }
});

app.delete('/itens/:id', autenticar, async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ mensagem: "Item removido" });
});

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