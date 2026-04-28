require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Usuario = require('./models/Usuario');

async function criar() {
  await mongoose.connect(process.env.MONGO_URI);

  const senhaHash = await bcrypt.hash("123", 10);

  await Usuario.create({
    email: "admin@barbearia.com",
    senha: senhaHash
  });

  console.log("Usuário criado");
  process.exit();
}

criar();