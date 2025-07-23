const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');

// Estilo do body dinamicamente
document.body.style.margin = '0';
document.body.style.paddingTop = '140px';
document.body.style.overflow = 'hidden';
document.body.style.background = '#f0f0f0';
document.body.style.fontFamily = 'sans-serif';

// Criar painel fixo centralizado com 1080px
const controlPanel = document.createElement('div');
controlPanel.style.position = 'fixed';
controlPanel.style.top = '0';
controlPanel.style.left = '50%';
controlPanel.style.transform = 'translateX(-50%)';
controlPanel.style.width = '95%';
controlPanel.style.background = 'rgba(255, 255, 255, 0.95)';
controlPanel.style.padding = '12px 20px';
controlPanel.style.display = 'grid';
controlPanel.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
controlPanel.style.gap = '12px';
controlPanel.style.zIndex = '10';
controlPanel.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
controlPanel.style.borderRadius = '8px';
document.body.appendChild(controlPanel);

// Função para criar sliders
const createSlider = (id, label, min, max, value, step = 1) => {
  const wrapper = document.createElement('label');
  wrapper.style.display = 'flex';
  wrapper.style.flexDirection = 'column';
  wrapper.style.fontSize = '12px';

  const span = document.createElement('span');
  span.textContent = `${label}: ${value}`;

  const input = document.createElement('input');
  input.type = 'range';
  input.id = id;
  input.min = min;
  input.max = max;
  input.step = step;
  input.value = value;

  input.addEventListener('input', () => {
    span.textContent = `${label}: ${input.value}`;
  });

  wrapper.appendChild(span);
  wrapper.appendChild(input);
  controlPanel.appendChild(wrapper);
};

// Função para criar dropdowns
const createDropdown = (id, label, options, defaultValue) => {
  const wrapper = document.createElement('label');
  wrapper.style.display = 'flex';
  wrapper.style.flexDirection = 'column';
  wrapper.style.fontSize = '12px';

  const span = document.createElement('span');
  span.textContent = `${label}:`;

  const select = document.createElement('select');
  select.id = id;

  options.forEach(option => {
    const opt = document.createElement('option');
    opt.value = option;
    opt.textContent = option;
    if (option === defaultValue) opt.selected = true;
    select.appendChild(opt);
  });

  wrapper.appendChild(span);
  wrapper.appendChild(select);
  controlPanel.appendChild(wrapper);
};

// Cria sliders
createSlider('cols', 'Colunas', 2, 100, 20);
createSlider('rows', 'Linhas', 2, 100, 20);
// createSlider('lineWidth', 'Espessura', 1, 10, 3);
createSlider('freq', 'Frequência', -0.01, 0.01, 0.001, 0.0001);
createSlider('amp', 'Amplitude', 0, 1, 0.02, 0.01);
createSlider('speed', 'Velocidade', 1, 100, 10);
createSlider('margem', 'Margem %', 0.1, 0.4, 0.2, 0.01);
createSlider('scaleMin', 'Escala min', 1, 100, 1);
createSlider('scaleMax', 'Escala max', 1, 100, 30);
// Cria dropdown para estilo da ponta da linha
createDropdown('lineCap', 'Ponta da Linha', ['butt', 'round', 'square'], 'round');

const settings = {
  dimensions: [1080, 1080],
  animate: true
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    const cols = parseInt(document.getElementById('cols').value);
    const rows = parseInt(document.getElementById('rows').value);
    // const lineWidth = parseFloat(document.getElementById('lineWidth').value);
    const freq = parseFloat(document.getElementById('freq').value);
    const speed = parseFloat(document.getElementById('speed').value);
    const margem = parseFloat(document.getElementById('margem').value);
    const scaleMin = parseFloat(document.getElementById('scaleMin').value);
    const scaleMax = parseFloat(document.getElementById('scaleMax').value);
    const amp = parseFloat(document.getElementById('amp').value);
    const lineCap = document.getElementById('lineCap').value;

    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    const numCells = cols * rows;
    const gridw = width * (1 - 2 * margem);
    const gridh = height * (1 - 2 * margem);
    const cellw = gridw / cols;
    const cellh = gridh / rows;
    const margx = width * margem;
    const margy = height * margem;

    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cellw;
      const y = row * cellh;
      const w = cellw * 0.8;

      // const n = random.noise2D(x + frame * speed, y, freq);
      const n = random.noise3D(x, y, frame * speed, freq);
      const angle = n * Math.PI * amp;

      const scale = math.mapRange(n, -1, 1, scaleMin, scaleMax);

      context.save();
      context.translate(x + margx + cellw * 0.5, y + margy + cellh * 0.5);
      context.rotate(angle);
      // context.lineWidth = lineWidth;

      context.lineWidth = scale;
      context.lineCap = lineCap;

      context.beginPath();
      context.moveTo(-w * 0.5, 0);
      context.lineTo(w * 0.5, 0);
      context.stroke();
      context.restore();
    }
  };
};

canvasSketch(sketch, settings);