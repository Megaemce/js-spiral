// ostatnia wersja 1154
"use strict"
var draw = SVG('drawing').size(600, 600)
function drawCircle(point, rad) {
   // used to determine whether color is passed or not
   if (arguments.length == 2) {
      draw.circle(rad * 2).stroke({
         width: 0.2,
         dasharray: 2
      }).fill('none').move(point.x - rad, point.y - rad);
   } else {
      draw.circle(rad * 2).stroke({
         width: 0.2,
         dasharray: 2
      }).fill(`${arguments[2]}`).move(point.x - rad, point.y - rad);
   }
}
function drawLine(pointA, pointB) {
   // drawLine can be (pointA, pointB, [color]) or (x1, y1, x2, y2, [color])
   if (arguments.length == 2) {
      draw.path(
         'M' + `${pointA.x}` + ' ' + `${pointA.y}` +
         'L' + `${pointB.x}` + ' ' + `${pointB.y}`
      ).stroke({
         width: 0.5,
         color: 'black'
      });
   } else {
      draw.path(
         'M' + `${pointA.x}` + ' ' + `${pointA.y}` +
         'L' + `${pointB.x}` + ' ' + `${pointB.y}`
      ).stroke({
         width: 0.5,
         color: "hsl(" + `${80+arguments[2]*4.35}` + ", 100%, 45%)",
         dasharray: 2.20
      });
   }
}
function animateLine(pointA, pointB) {}
function pointAtLength(angle, pointA, pointB) {
  // angle is a percent of AB lenght thus needs to be calculated
  // circle: (x - A.x)^2 + (y - A.y)^2 = (angle*|AB|)^2
  // line: y = funAVal * x + funBVal
   var intersections = {}

   var aX = pointA.x
   var aY = pointA.y
   var bX = pointB.x
   var bY = pointB.y
   var lenAB = segmentLength(pointA, pointB)
   var rad = angle * lenAB

   var funAVal = (aY - bY) / (aX - bX)
   var funBVal = aY - aX * (aY - bY) / (aX - bX)

   // vertical line is not a function thus normal calucation cannot be made
   if (aX == bX) {
      if (aY > bY) {
         intersections[0] = {
            x: aX,
            y: aY - rad
         }
      } else {
         intersections[0] = {
            x: aX,
            y: aY + rad
         }
      }
      intersections[1] = {
            x: 0,
            y: 0
         }  
   } else {

      var a = 1 + funAVal * funAVal;
      var b = -aX * 2 + (funAVal * (funBVal - aY)) * 2;
      var c = aX * aX + (funBVal - aY) * (funBVal - aY) - rad * rad;

      var solutions = [
        (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a),
         (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a)
      ];
   
      intersections[0] = {
         x: solutions[0],
         y: funAVal * solutions[0] + funBVal
      }
      intersections[1] = {
         x: solutions[1],
         y: funAVal * solutions[1] + funBVal
      }
   
      // check which intersection point is closed to point B
      if (segmentLength(intersections[0], pointB) < segmentLength(intersections[1], pointB)) {
         return intersections[0];
      } else {
         return intersections[1];
      }
   }
}
function centralPoint(pointA, pointB, pointC, pointD) {
   // finding the centeral point between 4 points (line AB and CD)
   var centralX = (pointA.x + pointB.x + pointC.x + pointD.x) / 4
   var centralY = (pointA.y + pointB.y + pointC.y + pointD.y) / 4
   var point = {
      x: centralX,
      y: centralY
   }
   return point;
}
function segmentLength(pointA, pointB) {
   return Math.sqrt((pointA.x - pointB.x) * (pointA.x - pointB.x) + (pointA.y - pointB.y) * (pointA.y - pointB.y))
}
function chooseCloser(pointCentral, pointA, pointB) {
   if (segmentLength(pointCentral, pointA) < segmentLength(pointCentral, pointB)) {
      return pointA;
   } else {
      return pointB;
   }
}
function makeDrawing(techDraw, aX, aY, boxL, boxW, angle, limit) {
   var box = {}
   var point = {}

   box.A = {
      x: 23,
      y: 12
   }
   box.B = {
      x: 301,
      y: 1
   }
   box.C = {
      x: 302,
      y: 280
   }
   box.D = {
      x: 2,
      y: 330
   }

   drawLine(box.A, box.B) // line AB
   drawLine(box.B, box.C) // line BC
   drawLine(box.C, box.D) // line CD
   drawLine(box.D, box.A) // line DA

   point[0] = box.A // break starting in point A 
   point[1] = pointAtLength(angle, box.B, box.C) // break on BC
   point[2] = pointAtLength(angle, box.C, box.D)
   point[3] = pointAtLength(angle, box.D, box.A)
   
   drawCircle(point[0], 2, "green")
   drawCircle(point[1], 2, "green")
   drawCircle(point[2], 2, "green")
   drawCircle(point[3], 2, "green")

   if (techDraw) {
      // circles at the edges
      drawCircle(box.B, angle * boxL)
      drawCircle(box.C, angle * boxW)
      drawCircle(box.D, angle * boxL)
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

   for (var i = 0; i < limit; i++) {
   
      var lineL = segmentLength(point[i], point[i + 1])
      var interPoint = pointAtLength(angle, point[i], point[i + 1])

      if (i < 4) {lineL = 1;}
      if (techDraw) {
         drawCircle(point[i], angle * lineL)
         drawCircle(interPoint, 3, "red")
      }

      point[Object.keys(point).length] = interPoint
      drawLine(point[i], point[i + 1], i)
   }
}
makeDrawing(
   0, // draw technical details boolean
   20, // starting point x coordinate
   33, // starting point y coordinate
   350, // length
   221, // width
   0.1242, // reflection length ratio [0-1]
   50 // number of reflection 
);
