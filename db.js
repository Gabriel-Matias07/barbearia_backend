const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB conectado");
  } catch (err) {
    console.error("Erro ao conectar:", err);
    process.exit(1);
  }
};

module.exports = conectarDB;