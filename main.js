let coords = [];
let drawFirst = true;
const draw = SVG('drawing').size(600, 600);
document.body.addEventListener('click', createBox);

function drawCircle(point, rad, optionalColor) {
  if (arguments.length == 2) {
    optionalColor = 'none';
  }
  draw.circle(rad * 2).stroke({
    width: 0.2,
    dasharray: 2
  }).fill(`${optionalColor}`).move(point.x - rad, point.y - rad);
}
function drawLine(pointA, pointB, optionalColor) {
  if (arguments.length == 2) {
    optionalColor = 'black';
  } else {
    optionalColor = `hsl(${80+optionalColor*4.35}, 100%, 45%)`
  }
  draw.path(`M${pointA.x} ${pointA.y}L${pointB.x} ${pointB.y}`
  ).stroke({
    width: 0.5,
    color: optionalColor
  });
}
function animateLine(pointA, pointB) {}
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

    intersections[0] = {x: solutionX0,y: funAVal * solutionX0 + funBVal}
    intersections[1] = {x: solutionX1,y: funAVal * solutionX1 + funBVal}

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
function segmentLength(pointA, pointB) {
  return Math.sqrt(Math.pow((pointA.x - pointB.x), 2) + Math.pow((pointA.y - pointB.y), 2))
}
function makeDrawing(box, ratio, limit, techDrawBool) {
  let point = [];

  point[0] = box[0];                               // break starting in point A 
  point[1] = pointAtLength(ratio, box[1], box[2], techDrawBool); // break on BC
  point[2] = pointAtLength(ratio, box[2], box[3], techDrawBool); // break on CD 
  point[3] = pointAtLength(ratio, box[3], box[0], techDrawBool); // break on DA

  for (let i = 0; i < limit; i++) {
    point.push(pointAtLength(ratio, point[i], point[i + 1], techDrawBool));
    drawLine(point[i], point[i + 1], i);
  }
}
function createBox(event) {
  if (coords.length < 4) {
    coords.push({x: event.clientX, y: event.clientY});
    drawCircle({x: event.clientX, y: event.clientY}, 2, 'black');
  }
  if ((coords.length > 1) && (coords.length < 4)) {
    drawLine(coords[coords.length-2], coords[coords.length-1]);
  }
  if ((coords.length == 4) && drawFirst) {
    drawLine(coords[2], coords[3]);
    drawLine(coords[3], coords[0]);
    makeDrawing(
/* list of points taken from user */ coords, 
/* reflection length ratio [0-1] */  0.2,
/* number of reflection  [0-inf] */  200,
/* draw technical details boolean */ 1
    )
    drawFirst = false;
  }
}
