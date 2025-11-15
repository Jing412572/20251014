//學習2程式碼所在
//兩個除號(//)代表註解
let palette = [];
let circleX, circleY, circleR;
let bgCircles = [];
let particles = []; // 新增一個陣列來存放爆炸粒子
let explosionSound; // 新增一個變數來存放音效

function preload() { // preload 會在 setup 前執行，用來預先載入資源
  soundFormats('mp3', 'ogg'); // 設定支援的音訊格式
  // 載入音效檔案，並加入成功與失敗的回呼函數
  explosionSound = loadSound('assets/explosion.mp3', 
    () => console.log('音效載入成功!'), 
    (err) => console.error('載入音效時發生錯誤:', err)
  );
}

function setup() { //setup函數只會執行一次，用來設定初始環境
  background('#284b63');
  createCanvas(windowWidth, windowHeight);

  // 初始化飄動圓
  circleR = 60;
  circleX = width / 2;
  circleY = height - circleR / 2;

  // 建立顏色調色盤
  palette = [
    color('#fb6f92'),
    color('#ff8fab'),
    color('#386641'),
    color('#a2d2ff'),
    color('#cdb4db'),
    color('#fb8500'),
    color('#8ecae6'),
    color('#a7c957'),
    color('#bc4749'),
    color('#e9c46a'),
    color('#ffd60a'),
    color('#edafb8'),
    color('#e0aaff'),
    color('#74c69d'),
    color('#a9def9')
  ];

  // 初始化背景圓陣列
  for (let i = 0; i < 80; i++) {
    let r = random(30, 120);
    // 直徑越小，飄越快；直徑越大，飄越慢，並帶一點隨機量
    let speed = map(r, 30, 120, 3.0, 0.8) * random(0.7, 1.25);
    bgCircles.push({
      x: random(width),
      y: random(height),
      r: r,
      alpha: random(50,255),
      speed: speed,
      color: random(palette),
      strokeColor: random(palette)
    });
  }
}

function draw() { //draw函數會不斷重複執行，用來繪製畫面
  background('#284b63');//每次重疊背景

  // 繪製並更新所有粒子
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.1; // 為粒子加上一點重力效果
    p.lifespan -= 2; // 粒子消失的速度
    if (p.lifespan <= 0) {
      particles.splice(i, 1); // 如果生命週期結束，就移除粒子
    } else {
      noStroke();
      p.color.setAlpha(p.lifespan); // 讓粒子漸漸變透明
      fill(p.color);
      ellipse(p.x, p.y, p.size, p.size); // 根據粒子自身大小繪製
    }
  }

  // 背景圓持續往上飄
  for(let i=0;i<bgCircles.length;i++){
    let c = bgCircles[i];
    let circleColor = c.color;
    let strokeColor = c.strokeColor;

    strokeColor.setAlpha(c.alpha); // 設定外框顏色的透明度
    stroke(strokeColor);
    strokeWeight(3); // 設定外框粗細為 3px
    circleColor.setAlpha(c.alpha); // 設定顏色的透明度
    fill(circleColor);
    ellipse(c.x, c.y, c.r, c.r);

    // 在圓的右上方加上一個半透明小方塊 (光澤效果)
    noStroke(); // 方塊不要有外框
    fill(255, 255, 255, 120); // 使用半透明的白色
    let squareSize = c.r / 4; // 方塊大小與圓的大小成正比
    rect(c.x + c.r * 0.15, c.y - c.r * 0.3, squareSize, squareSize, squareSize * 0.25); // 繪製四個角都圓弧的方塊

    c.y -= c.speed; // 根據每個圓自身的速度移動

    // 檢查是否到達畫面頂端
    if (c.y < -c.r/2) {
      // --- 重置圓圈 ---
      // 1. 重新隨機設定大小
      c.r = random(30, 120);
      // 2. 根據新大小重新計算速度
      c.speed = map(c.r, 30, 120, 3.0, 0.8) * random(0.7, 1.25);
      // 3. 重新隨機設定填滿顏色
      c.color = random(palette);
      // 4. 重新隨機設定外框顏色
      c.strokeColor = random(palette);
      // 5. 將圓移到視窗底部繼續飄動，並讓 x 重新隨機
      c.y = height + c.r / 2;
      c.x = random(width);
    }
  }
}

// 當滑鼠按下時觸發
function mousePressed() {
  // 從後往前遍歷，這樣會優先選中上層的圓
  for (let i = bgCircles.length - 1; i >= 0; i--) {
    let c = bgCircles[i];
    let d = dist(mouseX, mouseY, c.x, c.y);

    // 如果點擊位置在圓的範圍內
    if (d < c.r / 2) {
      // --- 播放音效 ---
      if (explosionSound.isLoaded()) { // 確保音效已載入完成
        explosionSound.play();
      }

      // --- 產生粒子效果 ---
      let particleCount = map(c.r, 30, 120, 20, 80); // 粒子數量與圓的大小成正比
      for (let j = 0; j < particleCount; j++) {
        particles.push({
          x: c.x, y: c.y,
          vx: random(-6, 6), // 增加X軸噴射速度
          vy: random(-6, 6), // 增加Y軸噴射速度
          color: random([c.color, c.strokeColor]),
          lifespan: random(80, 150), // 延長生命週期
          size: random(4, 8) // 隨機的粒子大小
        });
      }

      // --- 重置被點擊的圓 ---
      c.r = random(30, 120);
      c.speed = map(c.r, 30, 120, 3.0, 0.8) * random(0.7, 1.25);
      c.color = random(palette);
      c.strokeColor = random(palette);
      c.y = height + c.r / 2;
      c.x = random(width);

      break; // 找到並處理完一個圓後就跳出迴圈，避免一次點擊觸發多個重疊的圓
    }
  }
}
