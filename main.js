function areColliding(a, b){
  // Needs rewriting
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  var distance = Math.sqrt(dx*dx + dy*dy);
  var overlap = (a.radius + b.radius - distance) / (a.radius + b.radius);
  return overlap > 0.5;
}

function drawBubbles(){
  bufferContext.clearRect(0, 0, canvas.width, canvas.height);
  // Draw the bubbles
  for(var i=0; i<bubbles.length; i++){
    var bubble = bubbles[i];
    bufferContext.drawImage(bubble.getImage(), bubble.x - bubble.radius, bubble.y - bubble.radius);
  }
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bufferCanvas, 0, 0);

  // Move bubbles away from mouse at a speed inversely proportional to distance from mouse
  if(mouse.down){
    for(var i=0; i<bubbles.length; i++){
      var bubble = bubbles[i];
      var dx = bubble.x - mouse.x;
      var dy = bubble.y - mouse.y;
      var distance = Math.sqrt(dx*dx + dy*dy);
      var speedx = dx / Math.pow(distance, 2) * clickPower * 20 / bubble.radius;
      var speedy = dy / Math.pow(distance, 2) * clickPower * 20 / bubble.radius;
      bubble.speed.x = speedx;
      bubble.speed.y = speedy;
    }
  }
  for(var i=0; i<bubbles.length; i++){
    var bubble = bubbles[i];
    bubble.x += bubble.speed.x;
    bubble.y += bubble.speed.y;
    // Apply some friction
    bubble.speed.x *= 1 - friction;
    bubble.speed.y *= 1 - friction;
    if(bubble.x < padding){
      bubble.x = padding;
      bubble.speed.x *= -bounce;
    }
    if(bubble.y < padding){
      bubble.y = padding;
      bubble.speed.y *= -bounce;
    }
    if(bubble.x > canvas.width - padding){
      bubble.x = canvas.width - padding;
      bubble.speed.x *= -bounce;
    }
    if(bubble.y > canvas.height - padding){
      bubble.y = canvas.height - padding;
      bubble.speed.y *= -bounce;
    }
  }
  requestAnimationFrame(drawBubbles);
}

function randomColor(){
  var r = Math.random()*255;
  var g = Math.random()*255;
  // Color distance from black must be at least 100, as the background color is black
  var minimumBlue = r*r + g*g < 100 ? Math.sqrt(100*100 - r*r - g*g) : 0;
  var b = Math.random()*(255 - minimumBlue) + minimumBlue;
  var a = Math.random()*0.3+0.7;

  return {r: Math.floor(r), g: Math.floor(g), b: Math.floor(b), a: Math.floor(a*10)/10};
}

function colorFromScheme(name){
  var schemes = {
    easter: [
      {r: 131, g: 221, b: 214},
      {r: 139, g: 234, b: 175},
      {r: 247, g: 243, b: 150},
      {r: 242, g: 201, b: 201},
      {r: 172, g: 167, b: 196}

    ]
  };

  var chosenColor = schemes[name][Math.floor(Math.random() * schemes[name].length)];

  chosenColor.a = Math.random() * 0.3 + 0.7;

  return chosenColor;

}

window.onload = function(){
  bubbles = [];
  canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  context = canvas.getContext("2d");
  bufferCanvas = document.createElement("canvas");
  bufferContext = bufferCanvas.getContext("2d");
  bufferCanvas.width = canvas.width;
  bufferCanvas.height = canvas.height;

  //addBubble(canvas.width*3/8, canvas.height/2, 25, {r: 153, g: 153, b: 255, a: 0.9});
  //addBubble(canvas.width*5/8, canvas.height/2, 25, {r: 153, g: 153, b: 255, a: 0.9});

  // Settings
  friction = 0.01; // Slows bubbles over time
  bounce = 0.5; // How much speed remains after rebound off walls
  padding = 20; // How many pixels buffer from edge of screen the bubbles should bounce
  clickPower = 1000; // How much power a click should have

  for(var i=0; i<2000; i++){
    bubbles.push(new Bubble(Math.random() * canvas.width, Math.random() * canvas.height, Math.random()*20+10, colorFromScheme("easter")));
  }

  mouse = {};

  canvas.onmousedown = function(e){
    mouse.down = true;
    mouse.x = e.x;
    mouse.y = e.y;
  }

  canvas.ontouchstart = function(e){
    mouse.down = true;
    mouse.x = e.changedTouches[0].clientX;
    mouse.y = e.changedTouches[0].clientY;
  }

  canvas.onmousemove = function(e){
    mouse.x = e.x;
    mouse.y = e.y;
  }

  canvas.ontouchmove = function(e){
    mouse.x = e.changedTouches[0].clientX;
    mouse.y = e.changedTouches[0].clientY;
  }

  canvas.onmouseup = function(e){
    mouse.down = false;
    mouse.x = e.x;
    mouse.y = e.y;
  }

  canvas.ontouchend = function(e){
    mouse.down = false;
    mouse.x = e.changedTouches[0].clientX;
    mouse.y = e.changedTouches[0].clientY;
  }

  requestAnimationFrame(drawBubbles);
}
