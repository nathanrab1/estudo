import canvasSketch from 'canvas-sketch';

let cell = 10;
let radius = 5;
let shape = 'circle';
let bgValue = 255;
let loadedImage = null;
let manager = null;

let canvasWidth = 1080;
let canvasHeight = 1080;

const settings = {
  dimensions: [canvasWidth, canvasHeight]
};

const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');

// Cria e injeta o CSS externo
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = './style.css';
document.head.appendChild(link);

// Cria o painel de interface
const container = document.createElement('div');
container.className = 'input-container';

// Input de URL
const input = document.createElement('input');
input.type = 'text';
input.value = 'https://picsum.photos/200/200';
input.placeholder = 'Cole a URL da imagem aqui...';
input.className = 'image-input';
container.appendChild(input);

// Botão de carregar imagem
const button = document.createElement('button');
button.innerText = 'Carregar imagem';
button.className = 'load-button';
container.appendChild(button);

// Dropdown de forma
const shapeLabel = document.createElement('label');
shapeLabel.innerText = 'Forma:';
shapeLabel.className = 'slider-label';

const shapeSelect = document.createElement('select');
shapeSelect.className = 'dropdown-select';
['circle', 'square'].forEach((s) => {
  const opt = document.createElement('option');
  opt.value = s;
  opt.innerText = s === 'circle' ? 'Círculo' : 'Quadrado';
  shapeSelect.appendChild(opt);
});
shapeSelect.addEventListener('change', () => {
  shape = shapeSelect.value;
  if (manager) manager.render();
});
container.appendChild(shapeLabel);
container.appendChild(shapeSelect);

// Função para criar sliders com input numérico
function createSlider(labelText, min, max, value, onChange) {
  const wrapper = document.createElement('div');
  wrapper.className = 'slider-wrapper';

  const label = document.createElement('label');
  label.innerText = labelText;
  label.className = 'slider-label';

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = min;
  slider.max = max;
  slider.step = 1;
  slider.value = value;
  slider.className = 'slider-input';

  const numberInput = document.createElement('input');
  numberInput.type = 'number';
  numberInput.min = min;
  numberInput.max = max;
  numberInput.value = value;
  numberInput.className = 'number-input';

  slider.addEventListener('input', () => {
    numberInput.value = slider.value;
    onChange(parseInt(slider.value));
  });
  numberInput.addEventListener('input', () => {
    slider.value = numberInput.value;
    onChange(parseInt(numberInput.value));
  });

  wrapper.appendChild(label);
  wrapper.appendChild(slider);
  wrapper.appendChild(numberInput);
  container.appendChild(wrapper);
}

// Sliders
createSlider('Tamanho da célula:', 1, 50, cell, (val) => {
  cell = val;
  if (manager) manager.render();
});

createSlider('Raio:', 1, 50, radius, (val) => {
  radius = val;
  if (manager) manager.render();
});

createSlider('Fundo (0–255):', 0, 255, bgValue, (val) => {
  bgValue = val;
  if (manager) manager.render();
});

// Tamanho do canvas
const canvasSizeWrapper = document.createElement('div');
canvasSizeWrapper.className = 'slider-wrapper';

const widthInput = document.createElement('input');
widthInput.type = 'number';
widthInput.value = canvasWidth;
widthInput.min = 100;
widthInput.max = 4000;
widthInput.className = 'number-input';

const heightInput = document.createElement('input');
heightInput.type = 'number';
heightInput.value = canvasHeight;
heightInput.min = 100;
heightInput.max = 4000;
heightInput.className = 'number-input';

widthInput.addEventListener('change', () => updateCanvasSize());
heightInput.addEventListener('change', () => updateCanvasSize());

canvasSizeWrapper.appendChild(document.createTextNode('Largura:'));
canvasSizeWrapper.appendChild(widthInput);
canvasSizeWrapper.appendChild(document.createTextNode('Altura:'));
canvasSizeWrapper.appendChild(heightInput);
container.appendChild(canvasSizeWrapper);

function updateCanvasSize() {
  canvasWidth = parseInt(widthInput.value);
  canvasHeight = parseInt(heightInput.value);
  settings.dimensions = [canvasWidth, canvasHeight];
  if (loadedImage) startSketchWithImage(input.value.trim());
}

document.body.appendChild(container);

// Carrega imagem
const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Erro ao carregar imagem'));
    img.src = url;
  });
};

// Sketch
const startSketchWithImage = async (url) => {
  loadedImage = await loadImage(url);

  const sketch = () => {
    return ({ context, width, height }) => {
      const cols = Math.floor(width / cell);
      const rows = Math.floor(height / cell);
      const numCells = cols * rows;

      typeCanvas.width = cols;
      typeCanvas.height = rows;

      typeContext.drawImage(loadedImage, 0, 0, cols, rows);
      const typeData = typeContext.getImageData(0, 0, cols, rows).data;

      context.fillStyle = `rgb(${bgValue}, ${bgValue}, ${bgValue})`;
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

        if (shape === 'circle') {
          context.beginPath();
          context.arc(0, 0, radius, 0, Math.PI * 2);
          context.fill();
        } else {
          const size = radius * 2;
          context.fillRect(-radius, -radius, size, size);
        }

        context.restore();
      }
    };
  };

  if (manager) await manager.unmount?.();
  manager = await canvasSketch(sketch, {
    ...settings,
    styleCanvas: (canvas) => canvas.classList.add('canvas-output')
  });
};

// Botão
button.addEventListener('click', async () => {
  const url = input.value.trim();
  if (url) {
    await startSketchWithImage(url);
  } else {
    alert('Insira uma URL de imagem válida.');
  }
});
