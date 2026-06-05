const express = require('express');
const { gerarCsvItens } = require('../services/csvService');

const router = express.Router();

router.get('/exportar', async (req, res) => {

  try {

    const csv = await gerarCsvItens();

    const dataAtual = new Date()
      .toISOString()
      .slice(0, 10);

    const nomeArquivo = `itens-${dataAtual}.csv`;

    res.header(
      'Content-Type',
      'text/csv; charset=utf-8'
    );

    res.attachment(nomeArquivo);

    return res.send('\uFEFF' + csv);

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      erro: "Erro ao exportar dados em CSV"
    });
  }
});

module.exports = router;