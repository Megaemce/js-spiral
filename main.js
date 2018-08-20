let numPoints = 4;
let coords = [];
let drawFirst = true;

const canvas = document.getElementById('tutorial');
const ctx = canvas.getContext('2d');
document.body.addEventListener('click', createBox);

function drawCircle(point, rad, optionalColor) {
  ctx.beginPath();
  ctx.arc(point.x, point.y, rad, 0, 2 * Math.PI);
  ctx.strokeStyle = 'black';
  ctx.stroke();
  if (arguments.length == 3) {
    ctx.fillStyle = optionalColor;
    ctx.fill();
  }  
}
function drawLine(pointA, pointB, optionalColor) {
  if (arguments.length == 2) {
    optionalColor = 'black';
  } else {
    optionalColor = `hsl(${80+optionalColor*4.35}, 100%, 45%)`
  }
  
  ctx.beginPath();
  ctx.moveTo(pointA.x, pointA.y);
  ctx.lineTo(pointB.x, pointB.y);
  //ctx.setLineDash([5,10])
  //ctx.lineWidth = '0.5';
  ctx.strokeStyle = optionalColor;
  ctx.stroke();
}
function animate(points, granular) {
    let waypoints = [];
    let t = 1;
    // create (100/i) points in between two points
    for (let i = 1; i < points.length; i++) {
        const dx = points[i].x - points[i - 1].x;
        const dy = points[i].y - points[i - 1].y;
        for (let j = 0; j < granular; j++) {
            const x = points[i - 1].x + (dx * j) / granular;
            const y = points[i - 1].y + (dy * j) / granular;
            waypoints.push({
                x: x,
                y: y
            });
        }
    } // animate the drawing
    
    setInterval(function() {
      if (t < waypoints.length) {
        drawLine(waypoints[t - 1], waypoints[t], t)
        t++;
      }
    }, 1)
}
function segmentLength(pointA, pointB) {
  return Math.sqrt(Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2))
}
function pointAtLength(ratio, pointA, pointB, techDrawBool) {
  // returning point C on |AB| where |AC| = ratio*|AB|
  // circle function on point A: (x - aX)^2 + (y - aY)^2 = (ratio*|AB|)^2
  // function crossing through A i B: y = funAVal * x + funBVal

  let intersections = {};
  const rad = ratio * segmentLength(pointA, pointB);
  const aX = pointA.x;
  const aY = pointA.y;
  const bX = pointB.x;
  const bY = pointB.y;
  const funAVal = (aY - bY) / (aX - bX);
  const funBVal = aY - aX * (aY - bY) / (aX - bX);

  // vertical line is not a function thus normal calucation cannot be made
  if (aX == bX) {
    if (aY > bY) {
      intersections[0] = {x: aX, y: aY - rad}
      if (techDrawBool) {
        drawCircle(intersections[0], 2, 'green');
        drawCircle(pointA, rad);
      }
      return intersections[0];
    } else {
      intersections[0] = {x: aX, y: aY + rad}
      if (techDrawBool) {
        drawCircle(intersections[0], 2, 'green');
        drawCircle(pointA, rad);
      }
      return intersections[0];
    }
  } else {
    const a = 1 + funAVal * funAVal;
    const b = -aX * 2 + (funAVal * (funBVal - aY)) * 2;
    const c = aX * aX + (funBVal - aY) * (funBVal - aY) - rad * rad;
    const solutionX0 = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
    const solutionX1 = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);

    intersections[0] = {x: solutionX0, y: funAVal * solutionX0 + funBVal}
    intersections[1] = {x: solutionX1, y: funAVal * solutionX1 + funBVal}

    // check which intersection point is closed to point B
    if (segmentLength(intersections[0], pointB) < segmentLength(intersections[1], pointB)) {
      if (techDrawBool) {
        drawCircle(intersections[0], 2, 'green');
        drawCircle(pointA, rad);
      }
      return intersections[0];
    } else {
      if (techDrawBool) {
        drawCircle(intersections[1], 2, 'green');
        drawCircle(pointA, rad);
      }
      return intersections[1];
    }
  }
}
function makeDrawing(box, ratio, limit, techDrawBool) {
  let point = [];
  // reflections points at the "box"
  point[0] = box[0]
  for (let i = 1; i < box.length - 1; i++){
		point[i] = pointAtLength(ratio, box[i], box[i+1], techDrawBool);
  }
  point[box.length-1] = pointAtLength(ratio, box[box.length-1], box[0], techDrawBool);

  for (let i = 0; i < limit; i++) {
    point.push(pointAtLength(ratio, point[i], point[i + 1], techDrawBool));
  }
  
  animate(point, Math.round(ratio*100));
}
function createBox(event) {
  if (coords.length < numPoints) {
    coords.push({x: event.clientX, y: event.clientY});
    drawCircle({x: event.clientX, y: event.clientY}, 2, 'black');
  }
  if ((coords.length > 1) && (coords.length < numPoints)) {
    drawLine(coords[coords.length - 2], coords[coords.length - 1]);
  }
  if ((coords.length == numPoints) && drawFirst) {
    drawFirst = false;
    for (let i = 2; i < numPoints - 1; i++) {
      drawLine(coords[i], coords[i + 1]);
    }
    drawLine(coords[numPoints - 1], coords[0]);
    makeDrawing(
/* list of points taken from user */ coords, 
/* reflection length ratio [0-1] */  0.15,
/* number of reflection  [0-inf] */  80,
/* draw technical details boolean */ 0
    );   
  }
}
