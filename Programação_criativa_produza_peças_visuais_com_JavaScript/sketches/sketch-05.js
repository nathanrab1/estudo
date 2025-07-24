const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [1080, 1080]
};

const cell = 20;
const radius = 10;

const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');

const imageURL = 'https://http2.mlstatic.com/D_NQ_NP_744079-MLB50654783292_072022-O-the-beatles-vinil-the-beatles-magical-mystery-tour-2009-r.webp'; // Você pode mudar essa URL

let image; // será carregada antes do sketch

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // evita erros CORS
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

const start = async () => {
  image = await loadImage(imageURL);

  const sketch = ({ width, height }) => {
    const cols = Math.floor(width / cell);
    const rows = Math.floor(height / cell);
    const numCells = cols * rows;

    typeCanvas.width = cols;
    typeCanvas.height = rows;

    // Desenha a imagem no canvas auxiliar redimensionado
    typeContext.drawImage(image, 0, 0, cols, rows);

    const typeData = typeContext.getImageData(0, 0, cols, rows).data;

    return ({ context }) => {
      context.fillStyle = 'white';
      context.fillRect(0, 0, width, height);

      for (let i = 0; i < numCells; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);

        const x = col * cell;
        const y = row * cell;

        const r = typeData[i * 4 + 0];
        const g = typeData[i * 4 + 1];
        const b = typeData[i * 4 + 2];


        context.fillStyle = `rgb(${r}, ${g}, ${b})`;

        context.save();
        context.translate(x + cell * 0.5, y + cell * 0.5);
        context.beginPath();
        context.arc(0, 0, radius, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }
    };
  };

  await canvasSketch(sketch, settings);
};

start();
