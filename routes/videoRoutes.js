const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.get('/video', (req, res) => {
  const caminhoVideo = path.join(
    __dirname,
    '..',
    'public',
    'videos',
    'video.mp4'
  );

  if (!fs.existsSync(caminhoVideo)) {
    return res.status(404).json({
      erro: "Arquivo de vídeo não encontrado. Coloque um arquivo chamado video.mp4 em public/videos."
    });
  }

  const tamanhoVideo = fs.statSync(caminhoVideo).size;
  const range = req.headers.range;

  if (!range) {
    res.writeHead(200, {
      'Content-Length': tamanhoVideo,
      'Content-Type': 'video/mp4'
    });

    fs.createReadStream(caminhoVideo).pipe(res);
    return;
  }

  const partes = range.replace(/bytes=/, '').split('-');

  const inicio = parseInt(partes[0], 10);

  const fim = partes[1]
    ? parseInt(partes[1], 10)
    : tamanhoVideo - 1;

  const tamanhoParte = fim - inicio + 1;

  const streamVideo = fs.createReadStream(caminhoVideo, {
    start: inicio,
    end: fim
  });

  res.writeHead(206, {
    'Content-Range': `bytes ${inicio}-${fim}/${tamanhoVideo}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': tamanhoParte,
    'Content-Type': 'video/mp4'
  });

  streamVideo.pipe(res);
});

module.exports = router;