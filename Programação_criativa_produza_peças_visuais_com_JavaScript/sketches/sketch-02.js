const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ]
};


const sketch = () => {
  return ({ context, width, height }) => {
    const gray = random.rangeFloor(0, 255); // valor aleatório entre 0 e 255
    context.fillStyle = `rgb(${gray}, ${gray}, ${gray})`;
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'black';

    const cx = width * 0.5;
    const cy = height * 0.5;
    const w = width * 0.01;
    const h = height * 0.1;
    let x,y;

    const radius = width * 0.3;
    const num = 40;

    for (let i = 0; i < num ; i++){
      const slice = math.degToRad(360/num);
      const angle = slice * i;

      x = cx + radius * Math.sin(angle);
      y = cy + radius * Math.cos(angle);
      
      context.save();
      context.fillStyle = `rgb(${random.range(0, 255)}, 0, ${random.range(0, 255)})`;
      context.translate(x,y);
      context.rotate(-angle);
      context.scale(random.range(0.1,2),random.range(0.2,0.5));
      
      context.beginPath();
      context.rect(-w * 0.5, random.range(0, -h * 0.5), w,h);
      context.fill();
      context.restore();

      context.save();
      context.strokeStyle = `rgb(${random.range(0, 255)}, 0, ${random.range(0, 255)})`;
      context.translate(cx, cy);
      context.rotate(-angle);

      context.lineWidth = random.range(5,20);

      context.beginPath();
      context.arc(0,0,radius * random.range(0.7, 1.3 ), slice * random.range(1,-5), slice * random.range(1,5));
      context.stroke();
      context.restore();
    };

  };
};

canvasSketch(sketch, settings);
