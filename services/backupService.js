const fs = require('fs');
const path = require('path');
const { gerarCsvItens } = require('./csvService');

const pastaBackups = path.join(__dirname, '..', 'backups');

function garantirPastaBackups() {
  if (!fs.existsSync(pastaBackups)) {
    fs.mkdirSync(pastaBackups);
  }
}

async function fazerBackupItens() {
  garantirPastaBackups();

  const csv = await gerarCsvItens();

  const agora = new Date();

  const data = agora
    .toISOString()
    .slice(0, 10);

  const hora = agora
    .toTimeString()
    .slice(0, 8)
    .replaceAll(':', '-');

  const nomeArquivo = `backup-itens-${data}-${hora}.csv`;

  const caminhoArquivo = path.join(
    pastaBackups,
    nomeArquivo
  );

  fs.writeFileSync(
    caminhoArquivo,
    '\uFEFF' + csv,
    'utf8'
  );

  console.log(`Backup gerado no servidor: ${caminhoArquivo}`);

  return {
    nomeArquivo,
    caminhoArquivo
  };
}

module.exports = {
  fazerBackupItens
};