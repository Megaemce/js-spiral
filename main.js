"use strict"
var draw = SVG('drawing').size(600, 600)
function drawCircle(point, rad) {
   // used to determine whether color is passed or not
   if (arguments.length == 2) {
      draw.circle(rad*2).stroke({width:0.2, dasharray:2}).fill('none').move(point.x-rad,point.y-rad);
   } else {
      draw.circle(rad*2).stroke({width:0.2, dasharray:2}).fill(`${arguments[2]}`).move(point.x-rad,point.y-rad);
   }
}
function drawLine(pointA, pointB) {
// drawLine can be (pointA, pointB, [color]) or (x1, y1, x2, y2, [color])
   if (arguments.length == 2) {
      draw.path(
      'M'+`${pointA.x}`+' '+`${pointA.y}`+
      'L'+`${pointB.x}`+' '+`${pointB.y}`
      ).stroke({width:0.5, color: 'black'});
   } else {
      draw.path(
      'M'+`${pointA.x}`+' '+`${pointA.y}`+
      'L'+`${pointB.x}`+' '+`${pointB.y}`
      ).stroke({width:0.5, color: "hsl("+`${80+arguments[2]*4.35}`+", 100%, 45%)", dasharray:2.20});
   }
}
function animateLine(pointA, pointB) {
}
function circleLineIntersections(rad, circlePoint, pointA, pointB) {
    // circle: (x - circlePoint.x)^2 + (y - circlePoint.y)^2 = rad^2
    // line: y = funAVal * x + funBVal
    
    var aX = pointA.x
    var aY = pointA.y
    var bX = pointB.x
    var bY = pointB.y
    var cX = circlePoint.x
    var cY = circlePoint.y
     
    var funAVal = (aY-bY)/(aX-bX)
    var funBVal = aY-aX*(aY-bY)/(aX-bX)
    
    var a = 1 + funAVal*funAVal;
    var b = -cX * 2 + (funAVal * (funBVal - cY)) * 2;
    var c = cX*cX + (funBVal - cY)*(funBVal-cY) - rad*rad;
    
    var solutions = [
        (-b + Math.sqrt(b*b - 4 * a * c)) / (2 * a),
        (-b - Math.sqrt(b*b - 4 * a * c)) / (2 * a)
    ];
    var intersections = {}
    intersections[0] = {
       x: solutions[0],
      y: funAVal*solutions[0]+funBVal
    }
    intersections[1] = {
       x: solutions[1],
      y: funAVal*solutions[1]+funBVal
    }
    
    return intersections;
}
function centralPoint(pointA, pointB, pointC, pointD) {
// finding the centeral point between 4 points (line AB and CD)
   var centralX = (pointA.x + pointB.x + pointC.x + pointD.x)/4
   var centralY = (pointA.y + pointB.y + pointC.y + pointD.y)/4
   var point = {x: centralX, y: centralY}
   return point;
}
function lengthBetweenPoints(pointA, pointB) {
   return  Math.sqrt((pointA.x-pointB.x)*(pointA.x-pointB.x)+(pointA.y-pointB.y)*(pointA.y-pointB.y))
}
function chooseCloser(pointCentral, pointA, pointB) {
  if (lengthBetweenPoints(pointCentral, pointA) < lengthBetweenPoints(pointCentral, pointB)) {
    return pointA;
  } else { 
    return pointB;
  }
}
function makeDrawing(techDraw, aX, aY, boxL, boxW, angle, limit) {
   var box = {}
   var point = {}
   
   box.A = {x:aX, y:aY}
   box.B = {x:aX+boxL, y:aY} 
   box.C = {x:aX+boxL, y:aY+boxW}
   box.D = {x:aX, y:aY+boxW}
   box.center = centralPoint(box.A, box.B, box.C, box.D)

   drawLine(box.A, box.B) // line AB
   drawLine(box.B, box.C) // line BC
   drawLine(box.C, box.D) // line CD
   drawLine(box.D, box.A) // line DA
   
   point[0] = box.A                             // break starting in point A
   point[1] = {x:box.B.x, y:box.B.y+boxW*angle} // break on BC
   point[2] = {x:box.C.x-boxL*angle, y:box.C.y} // break on CD
   point[3] = {x:box.D.x, y:box.D.y-boxW*angle} // break on DA

   if (techDraw) {
      // circles at the edges
      drawCircle(box.B, angle*boxL)
      drawCircle(box.C, angle*boxW)
      drawCircle(box.D, angle*boxL)
      // points at the edges
      drawCircle(box.A, 2, "blue")
      drawCircle(box.B, 2, "blue")
      drawCircle(box.C, 2, "blue")
      drawCircle(box.D, 2, "blue")
      // points at the breaks
      drawCircle(point[1], 2, "green")
      drawCircle(point[2], 2, "green")
      drawCircle(point[3], 2, "green")
   }
   
   for (var i = 0; i<limit; i++) {

     box.center = centralPoint(point[i], point[i+1], point[i+2], point[i+3])

     var lineL = lengthBetweenPoints(point[i] ,point[i+1])
     var interPoint = circleLineIntersections(lineL*angle,point[i],point[i],point[i+1])
     
     if (techDraw) {
        drawCircle(point[i], angle*lineL)
        drawCircle(interPoint[0], 3, "red")
        drawCircle(interPoint[1], 3, "blue")
     }
     
     point[Object.keys(point).length] = chooseCloser(box.center,interPoint[0],interPoint[1])
     drawLine(point[i], point[i+1], i)
   }
}
makeDrawing(
   0,   // draw technical details boolean
   20,  // starting point x coordinate
   33,  // starting point y coordinate
   350, // length
   221, // width
   0.1, // reflection length ratio [0-1]
   300  // number of reflection 
 );
