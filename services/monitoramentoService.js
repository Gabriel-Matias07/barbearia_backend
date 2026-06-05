// Lista em memória onde os acessos serão armazenados.
// Para a atividade, isso é suficiente e simples.
// Depois, numa evolução real, poderíamos salvar esses dados no MongoDB.
const acessos = [];

function registrarAcesso(req, res, next) {
  const agora = new Date();

  acessos.push({
    metodo: req.method,
    rota: req.path,
    data: agora.toISOString(),
    hora: agora.getHours()
  });

  next();
}

function obterAcessos() {
  return acessos;
}

function obterAcessosDoMesAtual() {
  const agora = new Date();

  const mesAtual = agora.getMonth();
  const anoAtual = agora.getFullYear();

  return acessos.filter((acesso) => {
    const dataAcesso = new Date(acesso.data);

    return (
      dataAcesso.getMonth() === mesAtual &&
      dataAcesso.getFullYear() === anoAtual
    );
  });
}

function contarAcessosPorRota(acessosDoMes) {
  const contagem = {};

  acessosDoMes.forEach((acesso) => {
    const chave = `${acesso.metodo} ${acesso.rota}`;

    if (!contagem[chave]) {
      contagem[chave] = 0;
    }

    contagem[chave]++;
  });

  return Object.entries(contagem).map(([rota, total]) => ({
    rota,
    total
  }));
}

function identificarHorarioDePico(acessosDoMes) {
  if (acessosDoMes.length === 0) {
    return {
      hora: null,
      total: 0
    };
  }

  const contagemPorHora = {};

  acessosDoMes.forEach((acesso) => {
    const hora = acesso.hora;

    if (!contagemPorHora[hora]) {
      contagemPorHora[hora] = 0;
    }

    contagemPorHora[hora]++;
  });

  let horaPico = null;
  let maiorTotal = 0;

  Object.entries(contagemPorHora).forEach(([hora, total]) => {
    if (total > maiorTotal) {
      horaPico = Number(hora);
      maiorTotal = total;
    }
  });

  return {
    hora: horaPico,
    total: maiorTotal
  };
}

function gerarDadosRelatorioMonitoramento() {
  const acessosDoMes = obterAcessosDoMesAtual();

  const acessosPorRota = contarAcessosPorRota(acessosDoMes);

  const horarioPico = identificarHorarioDePico(acessosDoMes);

  return {
    totalAcessos: acessosDoMes.length,
    acessosPorRota,
    horarioPico
  };
}

module.exports = {
  registrarAcesso,
  obterAcessos,
  gerarDadosRelatorioMonitoramento
};