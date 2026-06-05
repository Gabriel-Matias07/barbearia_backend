const { Parser } = require('json2csv');
const Item = require('../models/Item');

async function gerarCsvItens() {
  const itens = await Item.find().lean();

  const dados = itens.map((item) => ({
    id: item._id.toString(),
    nome: item.nome,
    preco: item.preco,
    imagem: item.imagem || ''
  }));

  const campos = [
    'id',
    'nome',
    'preco',
    'imagem'
  ];

  const parser = new Parser({
    fields: campos
  });

  return parser.parse(dados);
}

module.exports = {
  gerarCsvItens
};