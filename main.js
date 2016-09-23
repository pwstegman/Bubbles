function addBubble(x, y, radius, color){
  var bubble = {x: x, y: y, radius: 0, color: color, targetRadius: radius, speed: {x: 0, y: 0}};
  bubbles.push(bubble);
}

function areColliding(a, b){
  // Needs rewriting
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  var distance = Math.sqrt(dx*dx + dy*dy);
  var overlap = (a.radius + b.radius - distance) / (a.radius + b.radius);
  return overlap > 0.5;
}

function drawBubbles(){
  requestAnimationFrame(drawBubbles);
  context.clearRect(0, 0, canvas.width, canvas.height);
  // Draw the bubbles
  for(var i=0; i<bubbles.length; i++){
    var bubble = bubbles[i];
    context.beginPath();
    context.arc(bubble.x, bubble.y, bubble.radius, 0, 2 * Math.PI, false);
    var percentExpanded = 1 - (bubble.targetRadius - bubble.radius) / bubble.targetRadius;
    context.fillStyle = "rgba(" + bubble.color.r + ", " + bubble.color.g + ", " + bubble.color.b + ", " + bubble.color.a * percentExpanded + ")";
    context.fill();
  }
  // Grow any bubbles that need to grow
  for(var i=0; i<bubbles.length; i++){
    var bubble = bubbles[i];
    if(bubble.radius < bubble.targetRadius){
      bubble.radius += 0.2;
    }
    if(bubble.radius > bubble.targetRadius){
      bubble.radius = bubble.targetRadius;
    }
  }
  // Move bubbles away from mouse at a speed inversely proportional to distance from mouse
  if(mouse.down){
    for(var i=0; i<bubbles.length; i++){
      var bubble = bubbles[i];
      var dx = bubble.x - mouse.x;
      var dy = bubble.y - mouse.y;
      var distance = Math.sqrt(dx*dx + dy*dy);
      var speedx = dx / Math.pow(distance, 2) * clickPower;
      var speedy = dy / Math.pow(distance, 2) * clickPower;
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
    // Check for collisions, TODO: better bubble joining animation
    /*
    var toRemove = [];
    for(var j=0; j<bubbles.length; j++){
      var bubble2 = bubbles[j];
      if(j != i && areColliding(bubble, bubble2)){
        if(bubble.radius > bubble2.radius){
          bubble.targetRadius = Math.sqrt(bubble.radius * bubble.radius + bubble2.radius * bubble2.radius);
          toRemove.push(j);
        }else{
          bubble2.targetRadius = Math.sqrt(bubble.radius * bubble.radius + bubble2.radius * bubble2.radius);
          toRemove.push(i);
        }
      }
    }
    for(var j=0; j<toRemove.length; j++){
      bubbles.splice(toRemove[j], 1);
    }*/
  }
}

function randomColor(){
  var r = Math.random()*255;
  var g = Math.random()*255;
  // Color distance from black must be at least 100, as the background color is black
  var minimumBlue = r*r + g*g < 100 ? Math.sqrt(100*100 - r*r - g*g) : 0;
  var b = Math.random()*(255 - minimumBlue) + minimumBlue;
  var a = Math.random();
  return {r: Math.floor(r), g: Math.floor(g), b: Math.floor(b), a: Math.floor(a*10)/10};
}

window.onload = function(){
  bubbles = [];
  canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  context = canvas.getContext("2d");

  //addBubble(canvas.width*3/8, canvas.height/2, 25, {r: 153, g: 153, b: 255, a: 0.9});
  //addBubble(canvas.width*5/8, canvas.height/2, 25, {r: 153, g: 153, b: 255, a: 0.9});

  // Settings
  friction = 0.01; // Slows bubbles over time
  bounce = 0.5; // How much speed remains after rebound off walls
  padding = 20; // How many pixels buffer from edge of screen the bubbles should bounce
  clickPower = 300; // How much power a click should have

  for(var i=0; i<100; i++){
    addBubble(Math.random() * canvas.width, Math.random() * canvas.height, Math.random()*40+10, randomColor());
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

  canvas.ondblclick = function(){
    bubbles = [];
    for(var i=0; i<100; i++){
      addBubble(Math.random() * canvas.width, Math.random() * canvas.height, Math.random()*40+10, randomColor());
    }
  }

  requestAnimationFrame(drawBubbles);
}
