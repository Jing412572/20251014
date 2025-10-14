//學習2程式碼所在
//兩個除號(//)代表註解
let circleX, circleY, circleR;
let bgCircles = [];
let starCount = 5;
let stars = [];
let explosionCircles = [];
let explosionTriggered = false;
let explosionCenter;
let explosionFrame = 0;
let explosionDelay = 60; // 爆破延遲幀數
let bubbleExplosions = []; // 新增泡泡爆破資料
let explosionInterval = 120; // 每隔多少幀爆破一次
let popSound;

function preload() {
  popSound = loadSound('balloon-pop.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // 你的初始化程式碼可放這裡
  circleR = 60;
  circleX = width / 2;
  circleY = height - circleR / 2;

  for(let i=0;i<30;i++){
    bgCircles.push({
      x: random(width),
      y: random(height),
      r: random(30,120),
      alpha: random(50,255),
      color: color(random(255), random(255), random(255)),
      stars: Array.from({length: starCount}, () => ({
        angle: random(TWO_PI),
        dist: 0,
        speed: random(2, 5),
        size: random(8, 16)
      }))
    });
  }
}

function draw() {
  background('#bde0fe');
  noStroke();

  // 左上角加上紫色文字
  fill(128, 0, 128); // 紫色
  textSize(15);
  text('414730779', 20, 30);

  // 背景圓持續往上飄
  for(let i=0;i<bgCircles.length;i++){
    let c = bgCircles[i];
    fill(c.color, c.alpha);
    ellipse(c.x, c.y, c.r, c.r);

    // 原本右上方的方框改為星星
    let squareSize = c.r / 4;
    let offset = c.r / 4;
    let starX = c.x + offset;
    let starY = c.y - offset;
    drawStar(starX, starY, squareSize / 2, squareSize / 4, 5);

    // 左上方星星裝飾（移除）
    // let starOffset = c.r / 4;
    // let starLX = c.x - starOffset;
    // let starLY = c.y - starOffset;
    // drawStar(starLX, starLY, squareSize / 2, squareSize / 4, 5);

    // 移除星星噴出的程式碼，只保留圓的爆破
    // for(let j=0;j<c.stars.length;j++){
    //   let s = c.stars[j];
    //   let sx = c.x + cos(s.angle) * s.dist;
    //   let sy = c.y + sin(s.angle) * s.dist;
    //   drawStar(sx, sy, s.size, s.size/2, 5);

    //   s.dist += s.speed;
    //   if(s.dist > c.r/2){
    //     s.dist = 0;
    //     s.angle = random(TWO_PI);
    //     s.speed = random(2, 5);
    //     s.size = random(8, 16);
    //   }
    // }

    c.y -= 1.2;
    if(c.y < -c.r/2){
      // 泡泡到頂端，產生爆破圓
      bubbleExplosions.push({
        x: c.x,
        y: 0,
        r: c.r,
        frame: 0,
        circles: Array.from({length: 8}, () => ({
          angle: random(TWO_PI),
          dist: 0,
          speed: random(3, 7),
          size: random(20, 40),
          color: color(random(255), random(255), random(255)),
          alpha: 255
        }))
      });
      c.y = height + c.r/2;
    }
  }

  // 泡泡爆破動畫（只畫圓，不畫星星）
  for(let i=bubbleExplosions.length-1; i>=0; i--){
    let be = bubbleExplosions[i];
    for(let j=0;j<be.circles.length;j++){
      let s = be.circles[j];
      let sx = be.x + cos(s.angle) * s.dist;
      let sy = be.y + sin(s.angle) * s.dist;
      fill(s.color, s.alpha);
      ellipse(sx, sy, s.size, s.size);
      s.dist += s.speed;
      s.alpha -= 8;
    }
    be.frame++;
    // 爆破動畫結束後移除
    if(be.frame > 30){
      bubbleExplosions.splice(i, 1);
    }
  }

  // 爆破效果（每隔 explosionInterval 幀觸發，位置亂數）
  if (frameCount % explosionInterval === 0) {
    explosionTriggered = true;
    explosionFrame = 0;
    explosionCenter = {
      x: random(width * 0.2, width * 0.8),
      y: random(height * 0.2, height * 0.8)
    };
    // 重新產生爆破圓
    explosionCircles = [];
    for(let i=0;i<20;i++){
      let angle = random(TWO_PI);
      explosionCircles.push({
        x: explosionCenter.x,
        y: explosionCenter.y,
        r: random(30, 80),
        color: color(random(255), random(255), random(255)),
        angle: angle,
        speed: random(4, 8),
        dist: 0,
        alpha: 255
      });
    }
  }

  if (explosionTriggered) {
    for(let i=0;i<explosionCircles.length;i++){
      let ec = explosionCircles[i];
      let ex = explosionCenter.x + cos(ec.angle) * ec.dist;
      let ey = explosionCenter.y + sin(ec.angle) * ec.dist;
      fill(ec.color, ec.alpha);
      ellipse(ex, ey, ec.r, ec.r);

      ec.dist += ec.speed;
      ec.alpha -= 6;
    }
    explosionFrame++;
    if (explosionFrame > 60) {
      explosionTriggered = false;
    }
  }
}

// 畫星星的函數
function drawStar(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  fill(255, 255, 0, 200); // 黃色星星
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius1;
    let sy = y + sin(a) * radius1;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius2;
    sy = y + sin(a + halfAngle) * radius2;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function mousePressed() {
  explosionTriggered = true;
  explosionFrame = 0;
  explosionCenter = {
    x: mouseX,
    y: mouseY
  };
  // 播放音效
  if (popSound) popSound.play();
  // 重新產生爆破圓
  explosionCircles = [];
  for(let i=0;i<20;i++){
    let angle = random(TWO_PI);
    explosionCircles.push({
      x: explosionCenter.x,
      y: explosionCenter.y,
      r: random(30, 80),
      color: color(random(255), random(255), random(255)),
      angle: angle,
      speed: random(4, 8),
      dist: 0,
      alpha: 255
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}