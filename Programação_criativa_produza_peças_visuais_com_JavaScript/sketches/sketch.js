const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');

// Reset do body para layout vertical
document.body.style.margin = '0';
document.body.style.background = '#f0f0f0';
document.body.style.fontFamily = 'sans-serif';
document.body.style.display = 'flex';
document.body.style.flexDirection = 'column';
document.body.style.alignItems = 'center';
document.body.style.padding = '20px';

// Criar painel de controle (não fixo!)
const controlPanel = document.createElement('div');
controlPanel.style.display = 'grid';
controlPanel.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
controlPanel.style.gap = '12px';
controlPanel.style.background = 'rgba(255, 255, 255, 0.95)';
controlPanel.style.padding = '12px 20px';
controlPanel.style.marginBottom = '20px';
controlPanel.style.marginTop = '60px';
controlPanel.style.maxWidth = '1080px';
controlPanel.style.width = '100%';
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

// Criar controles
createSlider('cols', 'Colunas', 2, 100, 20);
createSlider('rows', 'Linhas', 2, 100, 20);
createSlider('freq', 'Frequência', -0.01, 0.01, 0.001, 0.0001);
createSlider('amp', 'Amplitude', 0, 1, 0.2, 0.01);
createSlider('speed', 'Velocidade', 1, 100, 10);
// createSlider('margem', 'Margem %', 0, 0.4, 0.05, 0.01);
createSlider('scaleMin', 'Escala min', 1, 100, 1);
createSlider('scaleMax', 'Escala max', 1, 100, 30);
createDropdown('lineCap', 'Ponta da Linha', ['butt', 'round', 'square'], 'round');
createDropdown('cores', 'Cores', ['colorido', 'rb', 'pb'], 'rb');
createSlider('fundo', 'Fundo', 0, 255, 30);

const settings = {
  dimensions: [1080, 1080],
  animate: true
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    const cols = parseInt(document.getElementById('cols').value);
    const rows = parseInt(document.getElementById('rows').value);
    const freq = parseFloat(document.getElementById('freq').value);
    const speed = parseFloat(document.getElementById('speed').value);
    const margem = 0.05;
    const scaleMin = parseFloat(document.getElementById('scaleMin').value);
    const scaleMax = parseFloat(document.getElementById('scaleMax').value);
    const amp = parseFloat(document.getElementById('amp').value);
    const fundo = parseFloat(document.getElementById('fundo').value);
    const lineCap = document.getElementById('lineCap').value;
    const cores = document.getElementById('cores').value;

    // context.fillStyle = 'black';

    context.fillStyle = `rgb(${fundo}, ${fundo}, ${fundo})`;

    context.fillRect(0, 0, width, height);

    const numCells = cols * rows;
    const gridw = width * (1 - 2 * 0.05);
    const gridh = height * (1 - 2 * 0.05);
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

      const n = random.noise3D(x, y, frame * speed, freq);
      const angle = n * Math.PI * amp;
      const hue = math.mapRange(n, -1, 1, 0, 360);
      const red = math.mapRange(n, -1, 1, 0, 255);
      const blue = 255 - red
      const scale = math.mapRange(n, -1, 1, scaleMin, scaleMax); // <-- ESTA LINHA FALTAVA

      context.save();
      context.translate(x + margx + cellw * 0.5, y + margy + cellh * 0.5);
      context.rotate(angle);
      context.lineWidth = scale;
      context.lineCap = lineCap;

      if(cores === "rb"){
        context.strokeStyle = `rgb(${red}, 0, ${blue})`;
      }
      if(cores === "colorido"){
        context.strokeStyle = `hsl(${hue}, 100%, 50%)`;
      }
        if(cores === "pb"){
        context.strokeStyle = "white";
      }

      

      context.beginPath();
      context.moveTo(-w * 0.5, 0);
      context.lineTo(w * 0.5, 0);
      context.stroke();
      context.restore();
    }
  };
};

canvasSketch(sketch, settings);
