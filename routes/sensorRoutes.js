const express = require('express');

const {
  registrarLeituraSensor,
  obterUltimaLeituraSensor
} = require('../services/sensorService');

function criarSensorRoutes(io) {
  const router = express.Router();

  router.post('/sensor', (req, res) => {

    try {

      const {
        temperatura,
        umidade,
        sensor,
        origem
      } = req.body;

      if (temperatura === undefined || umidade === undefined) {
        return res.status(400).json({
          erro: "Temperatura e umidade são obrigatórias"
        });
      }

      const temperaturaNumero = Number(temperatura);
      const umidadeNumero = Number(umidade);

      if (Number.isNaN(temperaturaNumero) || Number.isNaN(umidadeNumero)) {
        return res.status(400).json({
          erro: "Temperatura e umidade devem ser números válidos"
        });
      }

      const leitura = registrarLeituraSensor({
        temperatura: temperaturaNumero,
        umidade: umidadeNumero,
        sensor,
        origem
      });

      io.emit('sensor', leitura);

      return res.json({
        mensagem: "Leitura recebida com sucesso",
        leitura
      });

    } catch (err) {

      console.log(err);

      return res.status(500).json({
        erro: "Erro ao receber dados do sensor"
      });
    }
  });

  router.get('/sensor/ultima-leitura', (req, res) => {
    const ultimaLeitura = obterUltimaLeituraSensor();

    if (!ultimaLeitura) {
      return res.status(404).json({
        mensagem: "Nenhuma leitura recebida até o momento"
      });
    }

    return res.json(ultimaLeitura);
  });

  return router;
}

module.exports = criarSensorRoutes;