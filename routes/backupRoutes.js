const express = require('express');
const { fazerBackupItens } = require('../services/backupService');

const router = express.Router();

router.get('/backup/manual', async (req, res) => {

  try {

    const backup = await fazerBackupItens();

    return res.json({
      mensagem: "Backup gerado com sucesso no servidor",
      arquivo: backup.nomeArquivo,
      caminho: backup.caminhoArquivo
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      erro: "Erro ao gerar backup manual"
    });
  }
});

module.exports = router;