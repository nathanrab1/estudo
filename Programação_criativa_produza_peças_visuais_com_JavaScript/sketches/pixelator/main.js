import canvasSketch from 'canvas-sketch';

let cell = 10;
let radius = 5;
let shape = 'circle';
let loadedImage = null;
let manager = null;

let canvasWidth = 1080;
let canvasHeight = 1080;

const settings = {
  dimensions: [canvasWidth, canvasHeight]
};

const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');

// Importa o CSS
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = './style.css';
document.head.appendChild(link);

// Cria o container de interface
const container = document.createElement('div');
container.className = 'input-container';
container.style.position = 'fixed';
container.style.top = '0';
container.style.left = '0';
container.style.right = '0';
container.style.zIndex = '10';
container.style.background = 'rgba(255, 255, 255, 0.95)';
container.style.backdropFilter = 'blur(8px)';
container.style.display = 'flex';
container.style.flexWrap = 'wrap';
container.style.gap = '10px';
container.style.padding = '10px';
container.style.justifyContent = 'center';

// Campo de URL da imagem
const input = document.createElement('input');
input.type = 'text';
input.value = 'https://picsum.photos/200/200';
input.placeholder = 'Cole a URL da imagem aqui...';
input.className = 'image-input';
input.style.flex = '1 1 300px';

// Botão de carregar imagem
const button = document.createElement('button');
button.innerText = 'Carregar imagem';
button.className = 'load-button';

container.appendChild(input);
container.appendChild(button);

// Dropdown de forma (círculo/quadrado)
const shapeLabel = document.createElement('label');
shapeLabel.innerText = 'Forma:';
shapeLabel.className = 'dropdown-label';

const shapeSelect = document.createElement('select');
shapeSelect.className = 'dropdown-select';
['circle', 'square'].forEach((optionValue) => {
  const option = document.createElement('option');
  option.value = optionValue;
  option.innerText = optionValue === 'circle' ? 'Círculo' : 'Quadrado';
  shapeSelect.appendChild(option);
});
shapeSelect.addEventListener('change', () => {
  shape = shapeSelect.value;
  if (manager) manager.render();
});

container.appendChild(shapeLabel);
container.appendChild(shapeSelect);

// Função utilitária para criar slider com input numérico
function createSlider(labelText, min, max, value, onInput) {
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
  numberInput.step = 1;
  numberInput.value = value;
  numberInput.className = 'number-input';

  slider.addEventListener('input', () => {
    numberInput.value = slider.value;
    onInput(parseInt(slider.value));
  });

  numberInput.addEventListener('input', () => {
    slider.value = numberInput.value;
    onInput(parseInt(numberInput.value));
  });

  wrapper.appendChild(label);
  wrapper.appendChild(slider);
  wrapper.appendChild(numberInput);
  container.appendChild(wrapper);
}

// Sliders de cell e radius
createSlider('Tamanho da célula:', 4, 50, cell, (val) => {
  cell = val;
  if (manager) manager.render();
});

createSlider('Raio dos círculos:', 1, 50, radius, (val) => {
  radius = val;
  if (manager) manager.render();
});

// Inputs de largura e altura do canvas
const canvasSizeWrapper = document.createElement('div');
canvasSizeWrapper.className = 'slider-wrapper';

const widthLabel = document.createElement('label');
widthLabel.innerText = 'Largura (px):';
widthLabel.className = 'slider-label';

const widthInput = document.createElement('input');
widthInput.type = 'number';
widthInput.value = canvasWidth;
widthInput.min = 100;
widthInput.max = 4000;
widthInput.className = 'number-input';

const heightLabel = document.createElement('label');
heightLabel.innerText = 'Altura (px):';
heightLabel.className = 'slider-label';

const heightInput = document.createElement('input');
heightInput.type = 'number';
heightInput.value = canvasHeight;
heightInput.min = 100;
heightInput.max = 4000;
heightInput.className = 'number-input';

canvasSizeWrapper.appendChild(widthLabel);
canvasSizeWrapper.appendChild(widthInput);
canvasSizeWrapper.appendChild(heightLabel);
canvasSizeWrapper.appendChild(heightInput);
container.appendChild(canvasSizeWrapper);

function updateCanvasSize() {
  const w = parseInt(widthInput.value);
  const h = parseInt(heightInput.value);
  if (!isNaN(w) && !isNaN(h)) {
    settings.dimensions = [w, h];
    canvasWidth = w;
    canvasHeight = h;
    if (loadedImage) startSketchWithImage(input.value.trim());
  }
}

widthInput.addEventListener('change', updateCanvasSize);
heightInput.addEventListener('change', updateCanvasSize);

document.body.appendChild(container);

// Função para carregar imagem
const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Erro ao carregar imagem'));
    img.src = url;
  });
};

// Função para iniciar o sketch
const startSketchWithImage = async (imageURL) => {
  loadedImage = await loadImage(imageURL);

  const sketch = () => {
    return ({ context, width, height }) => {
      if (!loadedImage) return;

      const cols = Math.floor(width / cell);
      const rows = Math.floor(height / cell);
      const numCells = cols * rows;

      typeCanvas.width = cols;
      typeCanvas.height = rows;

      typeContext.drawImage(loadedImage, 0, 0, cols, rows);
      const typeData = typeContext.getImageData(0, 0, cols, rows).data;

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

  // remove canvas antigo antes de criar outro
  if (manager && manager.unmount) {
    manager.unmount();
  }

  manager = await canvasSketch(sketch, settings);
};

// Ação do botão
button.addEventListener('click', async () => {
  const url = input.value.trim();
  if (!url) {
    alert('Por favor, insira uma URL de imagem válida.');
    return;
  }

  try {
    await startSketchWithImage(url);
  } catch (err) {
    alert('Erro ao carregar imagem.');
    console.error(err);
  }
});
