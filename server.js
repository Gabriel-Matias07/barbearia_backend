require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const PDFDocument = require('pdfkit');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const nodemailer = require('nodemailer');

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

// ================= CLOUDINARY =================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ================= MULTER =================
const upload = multer({ dest: 'uploads/' });

// ================= EMAIL =================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ================= 2FA =================
let codigos2FA = {};

// ================= LOGS =================
let logs = [];

// ================= HOME =================
app.get('/', (req, res) => {
  res.send("API rodando 🚀");
});

// ================= MIDDLEWARE =================
function apenasDiasUteis(req, res, next) {
  next(); // liberado
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

// ================= AUTH =================
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

// ================= LOGIN (AGORA COM 2FA) =================
app.post('/logar', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Email e senha obrigatórios" });
  }

  const user = await Usuario.findOne({ email });

  if (!user) return res.status(401).json({ erro: "Credenciais inválidas" });

  const senhaValida = await bcrypt.compare(senha, user.senha);

  if (!senhaValida) return res.status(401).json({ erro: "Credenciais inválidas" });

  const codigo = Math.floor(100000 + Math.random() * 900000);

  codigos2FA[email] = codigo;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Código de verificação',
    text: `Seu código é: ${codigo}`
  });

  res.json({ mensagem: "Código enviado para o email" });
});

// ================= VERIFICAR 2FA =================
app.post('/verificar-2fa', async (req, res) => {
  const { email, codigo } = req.body;

  const codigoSalvo = codigos2FA[email];

  if (!codigoSalvo) {
    return res.status(400).json({ erro: "Código não encontrado" });
  }

  if (Number(codigo) !== codigoSalvo) {
    return res.status(401).json({ erro: "Código inválido" });
  }

  const user = await Usuario.findOne({ email });

  const token = jwt.sign({ id: user._id }, SECRET);

  delete codigos2FA[email];

  res.json({ token });
});

// ================= UPLOAD =================
app.post('/upload', autenticar, upload.single('imagem'), async (req, res) => {
  try {
    const resultado = await cloudinary.uploader.upload(req.file.path);

    res.json({
      url: resultado.secure_url
    });

  } catch {
    res.status(500).json({ erro: "Erro ao enviar imagem" });
  }
});

// ================= DISTÂNCIA =================
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

// ================= PDF =================
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

// ================= CRUD =================

app.get('/itens', autenticar, async (req, res) => {
  res.json(await Item.find());
});

app.post('/itens', autenticar, async (req, res) => {
  const { nome, preco, imagem } = req.body;

  const novo = await Item.create({ nome, preco, imagem });

  res.json(novo);
});

app.put('/itens/:id', autenticar, async (req, res) => {
  const { nome, preco, imagem } = req.body;

  try {
    const atualizado = await Item.findByIdAndUpdate(
      req.params.id,
      { nome, preco, imagem },
      { returnDocument: 'after' }
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
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ erro: "Item não encontrado" });
    }

    res.json(item);

  } catch {
    res.status(400).json({ erro: "ID inválido" });
  }
});

// ================= LOGS =================
app.get('/logs', autenticar, (req, res) => {
  const { data } = req.query;

  const filtrados = logs.filter(l => l.data.startsWith(data));

  res.json(filtrados);
});

// ================= SERVER =================
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

module.exports = app;