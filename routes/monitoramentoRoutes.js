const express = require('express');
const PDFDocument = require('pdfkit');

const {
  obterAcessos,
  gerarDadosRelatorioMonitoramento
} = require('../services/monitoramentoService');

const router = express.Router();

router.get('/relatorio-monitoramento', (req, res) => {

  try {

    const dados = gerarDadosRelatorioMonitoramento();

    const doc = new PDFDocument({
      margin: 50
    });

    const dataAtual = new Date()
      .toISOString()
      .slice(0, 10);

    res.setHeader(
      'Content-Type',
      'application/pdf'
    );

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=relatorio-monitoramento-${dataAtual}.pdf`
    );

    doc.pipe(res);

    doc.fontSize(18).text(
      'Relatório de Monitoramento',
      {
        align: 'center'
      }
    );

    doc.moveDown();

    doc.fontSize(11).text(
      `Data de geração: ${new Date().toLocaleString('pt-BR')}`
    );

    doc.text(
      `Período analisado: mês atual`
    );

    doc.text(
      `Total de acessos no mês atual: ${dados.totalAcessos}`
    );

    doc.moveDown();

    doc.fontSize(14).text(
      'Acessos por rota',
      {
        underline: true
      }
    );

    doc.moveDown(0.5);

    if (dados.acessosPorRota.length === 0) {

      doc.fontSize(11).text(
        'Nenhum acesso registrado no mês atual.'
      );

    } else {

      doc.fontSize(11);

      dados.acessosPorRota.forEach((item) => {
        doc.text(`${item.rota} - ${item.total} acesso(s)`);
      });
    }

    doc.moveDown();

    doc.fontSize(14).text(
      'Horário de pico',
      {
        underline: true
      }
    );

    doc.moveDown(0.5);

    if (dados.horarioPico.hora === null) {

      doc.fontSize(11).text(
        'Ainda não há dados suficientes para identificar o horário de pico.'
      );

    } else {

      const horaFormatada = String(dados.horarioPico.hora)
        .padStart(2, '0');

      doc.fontSize(11).text(
        `O horário de maior acesso foi entre ${horaFormatada}:00 e ${horaFormatada}:59, com ${dados.horarioPico.total} acesso(s).`
      );
    }

    doc.moveDown();

    doc.fontSize(10).text(
      'Observação: os dados de monitoramento são mantidos em memória durante a execução do servidor. Caso o servidor seja reiniciado, a contagem é reiniciada.',
      {
        align: 'justify'
      }
    );

    doc.end();

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      erro: "Erro ao gerar relatório de monitoramento"
    });
  }
});

router.get('/monitoramento/acessos', (req, res) => {
  return res.json(obterAcessos());
});

module.exports = router;