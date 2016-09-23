function Bubble() {

  // Constructor
  // Defaults
  this.x = 0;
  this.y = 0;
  this.radius = 10;
  this.color = [255, 255, 255];
  this.speed = {x: 0, y: 0};
  if(checkTypes(arguments, ["number", "number", "number", "object"])){
    // x, y, radius, color object with r, g, b, and a
    this.x = arguments[0];
    this.y = arguments[1];
    this.radius = arguments[2];
    this.color = [arguments[3].r, arguments[3].g, arguments[3].b, arguments[3].a];
  }else{
    console.error("Invalid bubble values");
  }

  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  canvas.width = 2 * this.radius + 5;
  canvas.height = 2 * this.radius + 5;

  // Public
  this.rgbaColor = function(a){
    var alpha = this.color[3];
    if(a !== undefined){
      alpha = a;
    }
    return "rgba(" + this.color[0] + ", " + this.color[1] + ", " + this.color[2] + ", " + alpha + ")";
  }

  this.getImage = function(){
    return canvas;
  }

  this.drawImage = function(){
    context.beginPath();
    context.arc(Math.floor(this.radius), Math.floor(this.radius), Math.floor(this.radius), 0, 2 * Math.PI, false);
    var gradient = context.createRadialGradient(this.radius + this.radius * 0.3, this.radius - this.radius * 0.3, this.radius * 0.1, this.radius, this.radius, this.radius);
    gradient.addColorStop(0, this.rgbaColor());
    gradient.addColorStop(1, this.rgbaColor(0.6));
    context.fillStyle = gradient;
    context.fill();
  }

  // Private
  function checkTypes(arr, types){
    for(var i=0; i<arr.length; i++){
      if(typeof arr[i] !== types[i]){
        return false;
      }
    }
    return true;
  }

  // Init calls
  this.drawImage();

}
