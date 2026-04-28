const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  nome: String,
  preco: Number
});

module.exports = mongoose.model('Item', ItemSchema);