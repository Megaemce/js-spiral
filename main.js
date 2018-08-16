"use strict"
var draw = SVG('drawing').size(650, 500)

function store(array, xVal, yVal) {
  array.push({x: xVal, y: yVal});
}
function drawCircle(xVal, yVal, rad) {
   // used to determine whether color is passed or not
   if (arguments.length == 3) {
      draw.circle(rad*2).stroke({width:0.2, dasharray:2}).fill('none').move(xVal-rad,yVal-rad);
   } else {
      draw.circle(rad*2).stroke({width:0.2, dasharray:2}).fill(`${arguments[3]}`).move(xVal-rad,yVal-rad);
   }
}
function drawLine(pointA, pointB) {
// drawLine can be (pointA, pointB, [color]) or (x1, y1, x2, y2, [color])
   if ( (arguments.length <= 3) &&
   (typeof pointA === 'object') && (typeof pointB === 'object') &&
   (typeof pointA.x === 'number') && (typeof pointA.y === 'number') &&
   (typeof pointB.x === 'number') && (typeof pointB.y === 'number')) {
      if (arguments.length == 2) {
         draw.path('M'+`${pointA.x}`+' '+`${pointA.y}`+'L'+`${pointB.x}`+' '+`${pointB.y}`).stroke({width:0.5, color: 'black'});
      } else {
         draw.path('M'+`${pointA.x}`+' '+`${pointA.y}`+'L'+`${pointB.x}`+' '+`${pointB.y}`).stroke({width:0.5, color: '#'+`${371+arguments[2]}`, dasharray:2.20});
      }
   } else { 
      if (arguments.length == 4) {
         draw.path('M'+`${arguments[0]}`+' '+`${arguments[1]}`+'L'+`${arguments[2]}`+' '+`${arguments[3]}`).stroke({width:0.5, color: 'black'});
      } else {
         draw.path('M'+`${arguments[0]}`+' '+`${arguments[1]}`+'L'+`${arguments[2]}`+' '+`${arguments[3]}`).stroke({width:0.5, color: '#'+`${371+arguments[5]}`, dasharray:2.20});
      }
   }
}
function makeDrawing(aX, aY, length, width, angle, limit) {
   var breaks = []
   var i
   
   drawLine(aX, aY, aX+length, aY)              // line AB
   drawLine(aX+length, aY, aX+length, aY+width) // line BC
   drawLine(aX+length, aY+width, aX, aY+width)  // line CD
   drawLine(aX, aY+width, aX, aY)               // line DA
   store(breaks, aX, aY)                        // breaks[0] = break starting in point A
   store(breaks, aX+length, aY+angle)           // breaks[1] = break on BC
   store(breaks, aX+length-angle, aY+width)     // breaks[2] = break on CD
   store(breaks, aX, aY+width-angle)            // breaks[3] = break on DA
   

   for (i = 0; i<=limit; i++) {
      drawCircle(breaks[i].x, breaks[i].y, 2, "blue")
      var l =   length-angle*i
      var under = Math.sqrt(angle*angle+l*l)
      var tempX1 = breaks[i].x-angle*l/under
      var tempY1 = breaks[i].y-angle*angle/under 
      var tempX2 = breaks[i].x+angle*l/under
      var tempY2 = breaks[i].y+angle*angle/under

   
      if ((tempX1  > length) || (tempY1 > length) || (tempX1 < 0) || (tempY1 < 0) ) {
         draw.text(`${i}`+"_X2").move(tempX2,tempY2)
         drawCircle(tempX2, tempY2, 2, "blue")
         drawCircle(breaks[i].x, breaks[i].y, angle)
        //store(tempX2,tempY2,breaks); 
      } else {    
         draw.text(`${i}`+"_X1").move(tempX1,tempY1)
         drawCircle(tempX1, tempY1, 2, "blue")
         drawCircle(breaks[i].x, breaks[i].y, angle)
         //store(tempX1,tempY1,breaks) ;
      }

      drawLine(breaks[i],breaks[i+1],i);
   }
}
makeDrawing(20, 20, 200, 200, 50, 3);
