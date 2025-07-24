import canvasSketch from 'canvas-sketch';

// ----- Adiciona o CSS externo dinamicamente -----
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = './style.css';
document.head.appendChild(link);

// ----- Cria input de URL e botão -----
const container = document.createElement('div');
container.className = 'input-container';

const input = document.createElement('input');
input.type = 'text';
input.placeholder = 'Cole a URL da imagem aqui...';
input.className = 'image-input';

const button = document.createElement('button');
button.innerText = 'Carregar imagem';
button.className = 'load-button';

container.appendChild(input);
container.appendChild(button);
document.body.appendChild(container);

// ----- Canvas-sketch settings -----
const settings = {
  dimensions: [1080, 1080]
};

const cell = 10;
const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');

let manager;

const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Erro ao carregar imagem'));
    img.src = url;
  });
};

const startSketchWithImage = async (imageURL) => {
  const image = await loadImage(imageURL);

  const sketch = ({ width, height }) => {
    const cols = Math.floor(width / cell);
    const rows = Math.floor(height / cell);
    const numCells = cols * rows;

    typeCanvas.width = cols;
    typeCanvas.height = rows;

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
        const a = typeData[i * 4 + 3];

        const brightness = (r + g + b) / 3;
        const radius = (brightness / 255) * (cell * 0.5);

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

  if (manager) await manager.dispose();
  manager = await canvasSketch(sketch, settings);
};

// ----- Botão carrega imagem e inicia canvas-sketch -----
button.addEventListener('click', () => {
  const url = input.value.trim();
  if (url) {
    startSketchWithImage(url);
  } else {
    alert('Por favor, insira uma URL válida de imagem.');
  }
});
