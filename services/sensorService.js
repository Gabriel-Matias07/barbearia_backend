let ultimaLeituraSensor = null;

function registrarLeituraSensor(dados) {
  const leitura = {
    temperatura: Number(dados.temperatura),
    umidade: Number(dados.umidade),
    sensor: dados.sensor || 'DHT22',
    origem: dados.origem || 'Wokwi ESP32',
    data: new Date().toISOString(),
    horario: new Date().toLocaleTimeString('pt-BR')
  };

  ultimaLeituraSensor = leitura;

  return leitura;
}

function obterUltimaLeituraSensor() {
  return ultimaLeituraSensor;
}

function configurarSocketSensor(io) {
  io.on('connection', (socket) => {
    console.log('Cliente conectado ao Socket.IO');

    const ultimaLeitura = obterUltimaLeituraSensor();

    if (ultimaLeitura) {
      socket.emit('sensor', ultimaLeitura);
    }

    socket.on('disconnect', () => {
      console.log('Cliente desconectado do Socket.IO');
    });
  });
}

module.exports = {
  registrarLeituraSensor,
  obterUltimaLeituraSensor,
  configurarSocketSensor
};