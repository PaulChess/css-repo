var raf = (function () {
  var TIME = Math.floor(1000 / 60);
  var frame, cancel;
  var frames = {};
  var lastFrameTime = 0;

  if (typeof requestAnimationFrame === 'function' && typeof cancelAnimationFrame === 'function') {
    frame = function (cb) {
      var id = Math.random();

      frames[id] = requestAnimationFrame(function onFrame(time) {
        if (lastFrameTime === time || lastFrameTime + TIME - 1 < time) {
          lastFrameTime = time;
          delete frames[id];

          cb();
        } else {
          frames[id] = requestAnimationFrame(onFrame);
        }
      });

      return id;
    };
    cancel = function (id) {
      if (frames[id]) {
        cancelAnimationFrame(frames[id]);
      }
    };
  } else {
    frame = function (cb) {
      return setTimeout(cb, TIME);
    };
    cancel = function (timer) {
      return clearTimeout(timer);
    };
  }

  return {
    frame: frame,
    cancel: cancel
  };
}());

function toDecimal(str) {
  return parseInt(str, 16);
}

function hexToRgb(str) {
  var val = String(str).replace(/[^0-9a-f]/gi, '');

  if (val.length < 6) {
    val = val[0] + val[0] + val[1] + val[1] + val[2] + val[2];
  }

  return {
    r: toDecimal(val.substring(0, 2)),
    g: toDecimal(val.substring(2, 4)),
    b: toDecimal(val.substring(4, 6))
  };
}

// 控制单个例子运动
function updateFetti(context, fetti) {
  var progress = (fetti.tick++) / fetti.totalTicks;
  if (progress > 1) {
    return;
  }
  fetti.x += Math.cos(fetti.angle2D) * fetti.velocity; // 左下角
  fetti.y += Math.sin(fetti.angle2D) * fetti.velocity + fetti.gravity; // 左下角

  fetti.velocity *= fetti.decay;
  fetti.tiltAngle += 0.1;
  fetti.tiltSin = Math.sin(fetti.tiltAngle);
  fetti.tiltCos = Math.cos(fetti.tiltAngle);
  fetti.random = Math.random() + 7;

  var x1 = fetti.x;
  var y1 = fetti.y;

  var x2 = fetti.x + (fetti.random * fetti.tiltCos); // 左上角
  var y2 = fetti.y + (fetti.random * fetti.tiltSin); // 左上角

  var x3 = x2 + fetti.random;
  var y3 = y2;

  var x4 = fetti.x + fetti.random;
  var y4 = fetti.y;


  context.fillStyle = 'rgba(' + fetti.color.r + ', ' + fetti.color.g + ', ' + fetti.color.b + ', ' + (1 -
    progress) + ')';
  context.beginPath();

  context.moveTo(Math.floor(x1), Math.floor(y1));
  context.lineTo(Math.floor(x2), Math.floor(y2));
  context.lineTo(Math.floor(x3), Math.floor(y3));
  context.lineTo(Math.floor(x4), Math.floor(y4));

  context.closePath();
  context.fill();

  return fetti.tick < fetti.totalTicks;
}

function getCanvas(zIndex) {
  var canvas = document.createElement('canvas');

  canvas.style.position = 'fixed';
  canvas.style.top = '0px';
  canvas.style.left = '0px';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = zIndex;

  return canvas;
}

function setCanvasWindowSize(canvas) {
  canvas.width = document.documentElement.clientWidth;
  canvas.height = document.documentElement.clientHeight;
}
const canvas = getCanvas(100);
setCanvasWindowSize(canvas);
document.body.appendChild(canvas);
var context = canvas.getContext('2d');
const colors = [
  '#26ccff',
  '#a25afd',
  '#ff5e7e',
  '#88ff5a',
  '#fcff42',
  '#ffa62d',
  '#ff36ff'
];
var arr = []
for (let i = 0; i < 20; i++) {
  arr.push({
    "x": 445,
    "y": 541,
    "velocity": (45 * 0.5) + (Math.random() * 20),
    "angle2D": 3 / 2 * Math.PI + Math.random() * 1 / 4 * Math.PI,
    "tiltAngle": Math.random() * Math.PI,
    "color": hexToRgb(colors[Math.floor(Math.random() * 7)]),
    "tick": 0,
    "totalTicks": 200,
    "decay": 0.9,
    "random": 0,
    "tiltSin": 0,
    "tiltCos": 0,
    "gravity": 3,
    "scalar": 1
  })
}
var animationFrame = null;

function update() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  arr = arr.filter(item => {
    return updateFetti(context, item);
  });

  if (arr.length) {
    animationFrame = raf.frame(update);
  }
}

start.onclick = () => {
  if (!animationFrame) {
    animationFrame = raf.frame(update);
  } else {
    for (let i = 0; i < 20; i++) {
      arr.push({
        "x": 445,
        "y": 541,
        "velocity": (45 * 0.5) + (Math.random() * 20),
        "angle2D": 3 / 2 * Math.PI + Math.random() * 1 / 4 * Math.PI,
        "tiltAngle": Math.random() * Math.PI,
        "color": hexToRgb(colors[Math.floor(Math.random() * 7)]),
        "tick": 0,
        "totalTicks": 200,
        "decay": 0.9,
        "random": 0,
        "tiltSin": 0,
        "tiltCos": 0,
        "gravity": 3,
        "scalar": 1
      })
    }
  }
}