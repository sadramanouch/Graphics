import { Framebuffer } from './framebuffer.js';
import { Rasterizer } from './rasterizer.js';
// DO NOT CHANGE ANYTHING ABOVE HERE

////////////////////////////////////////////////////////////////////////////////
// TODO: Implement functions drawLine(v1, v2) and drawTriangle(v1, v2, v3) below.
////////////////////////////////////////////////////////////////////////////////

// take two vertices defining line and rasterize to framebuffer
Rasterizer.prototype.drawLine = function(v1, v2) {
  const [x1, y1, [r1, g1, b1]] = v1;
  const [x2, y2, [r2, g2, b2]] = v2;
  // TODO/HINT: use this.setPixel(x, y, color) in this function to draw line
  // this.setPixel(Math.floor(x1), Math.floor(y1), [r1, g1, b1]);
  // this.setPixel(Math.floor(x2), Math.floor(y2), [r2, g2, b2]);

  if(x1 == x2) {
    let yEnd = Math.max(y1, y2);
    let yStart = Math.min(y1, y2);
    let length = yEnd - yStart;
    for(let y = yStart; y <= yEnd; y++){
      let v1_ratio = this.lineLength([x2, y2], [x1, y])/length;
      let v2_ratio = this.lineLength([x1, y1], [x1, y])/length;
      let colour = [r1*v1_ratio + r2*v2_ratio, g1*v1_ratio + g2*v2_ratio, b1*v1_ratio + b2*v2_ratio]
      this.setPixel(Math.floor(x1), Math.floor(y), colour);
      console.log(x1 + ", ", y);
    }
    return
  }

  let steepLine = false;
  if (Math.abs(y2 - y1) > Math.abs(x2 - x1)) {
    steepLine = true;
  }
  if (steepLine) {
    [x1, y1, r1, g1, b1, x2, y2, r2, g2, b2] = [y1, x1, r1, g1, b1, y2, x2, r2, g2, b2];
  }
  let xStart = x1;
  let xEnd = x2;
  let yStart = y1;
  let yEnd = y2;
  if (x2 < x1) {
    xStart = x2;
    xEnd = x1;
    yStart = y2;
    yEnd = y1;
  }
  let slope = (yEnd - yStart) / (xEnd - xStart);
  for (let x = xStart, y = yStart; x <= xEnd; x++) {
    let v1_ratio, v2_ratio;
    if (steepLine) {
      v1_ratio = this.lineLength([y2, x2], [y, x]);
      v2_ratio = this.lineLength([y1, x1], [y, x]);
    } 
    else {
      v1_ratio = this.lineLength([x2, y2], [x, y]);
      v2_ratio = this.lineLength([x1, y1], [x, y]);
    }
    let colour = [r1 * v1_ratio + r2 * v2_ratio, g1 * v1_ratio + g2 * v2_ratio, b1 * v1_ratio + b2 * v2_ratio];
    let coordinateX, coordinateY;
    if (steepLine) {
      coordinateX = Math.floor(y);
      coordinateY = Math.floor(x);
    } 
    else {
      coordinateX = Math.floor(x);
      coordinateY = Math.floor(y);
    }
    this.setPixel(coordinateX, coordinateY, colour);
    if (steepLine) {
      console.log(y + ", " + x);
    } 
    else {
      console.log(x + ", " + y);
    }
    y += slope;
  }
}

Rasterizer.prototype.lineLength = function(v1, v2) {
  const [x1, y1] = v1;
  const [x2, y2] = v2;
  return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2))
}

// take 3 vertices defining a solid triangle and rasterize to framebuffer
Rasterizer.prototype.drawTriangle = function(v1, v2, v3) {
  const [x1, y1, [r1, g1, b1]] = v1;
  const [x2, y2, [r2, g2, b2]] = v2;
  const [x3, y3, [r3, g3, b3]] = v3;
  //Step 1: get the bounding box
  let xStart = Math.min(x1, x2, x3);
  let yStart = Math.min(y1, y2, y3);
  let xEnd = Math.max(x1, x2, x3);
  let yEnd = Math.max(y1, y2, y3);
  
  let main_tringle_area = this.triangleArea([x1, y1], [x2, y2], [x3, y3]);

  for (let x = xStart; x <= xEnd; x++) {
    for (let y = yStart; y <= yEnd; y++) {
      let area1 = this.triangleArea([x, y], [x2, y2], [x3, y3]);
      let area2 = this.triangleArea([x, y], [x1, y1], [x3, y3]);
      let area3 = this.triangleArea([x, y], [x1, y1], [x2, y2]);
      if(area1 + area2 + area3 <= main_tringle_area){
        let u = area1/main_tringle_area;
        let v = area2/main_tringle_area;
        let w = area3/main_tringle_area;
        let colour = [r1*u+r2*v+r3*w, g1*u+g2*v+g3*w, b1*u+b2*v+b3*w];
        this.setPixel(Math.floor(x), Math.floor(y), colour);
      }
    }
  }
}

Rasterizer.prototype.triangleArea = function(v1, v2, v3) {
  const [x1, y1] = v1;
  const [x2, y2] = v2;
  const [x3, y3] = v3;
  return Math.abs((x1*(y2 - y3) + x2*(y3 - y1) + x3*(y1 - y2))/2);
}

////////////////////////////////////////////////////////////////////////////////
// EXTRA CREDIT: change DEF_INPUT to create something interesting!
////////////////////////////////////////////////////////////////////////////////
const DEF_INPUT = [
  "v,50,10,1.0,0.0,0.0;",    
  "v,60,40,0.0,1.0,0.0;",    
  "v,90,50,0.0,0.0,1.0;",    
  "v,60,60,1.0,1.0,1.0;",    
  "v,50,90,1.0,0.0,1.0;",    
  "v,40,60,0.0,1.0,1.0;",    
  "v,10,50,1.0,1.0,0.0;",    
  "v,40,40,0.5,0.5,0.5;",    
  "t,0,1,2;",                
  "t,0,2,3;",                
  "t,0,3,4;",                
  "t,0,4,5;",                
  "t,0,5,6;",                
  "t,0,6,1;", 
].join("\n");


// DO NOT CHANGE ANYTHING BELOW HERE
export { Rasterizer, Framebuffer, DEF_INPUT };