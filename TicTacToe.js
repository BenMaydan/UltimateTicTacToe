var moves = 0;
var grid = [[], [], []];
var p0n;
var p1n;
var p2n;
var sBetween = 15;

var white;
var red;
var green;
var blue;
var black;

var tie;
var gameOver;
var overallWinner;

function setup() {
  resizeCanvas(windowWidth, windowHeight, true);
  
  textSize(32);
  textAlign(CENTER, TOP);
  
  p0n = 0;
  p1n = 1;
  p2n = 2;
  
  white = [255, 255, 255];
  red = [232, 63, 66];
  green = [0, 210, 0];
  fred = [255, 145, 126];
  fgreen = [176, 255, 173];
  blue = [0, 0, 255];
  gray = [204, 204, 192];
  black  = [0, 0, 0];
  
  tie = false;
  gameOver = false;
  overallWinner= -1;
  
  var w = width/6;
  var h = height/4;
  var x = width/2-w-(w/2)-sBetween;
  var y = height/2-h-(h/2)+30-(sBetween*2);
  for (var i = 0; i < 3; i++) {
    for (var ii = 0; ii < 3; ii++) {
      grid[i].push(new Grid(x, y, w, h).setColor(blue, blue).setStrokeWidth(5, 5));
      x += w+sBetween;
    }
    x = width/2-w-(w/2)-sBetween;
    y += h+sBetween;
  }
}

function keyPressed() {
  if (key == 'e' || keyCode == ESC)
    fullscreen(!fullscreen());
}

function mousePressed() {
  if (!gameOver) {
    for (var i = 0; i < grid.length; i++)
      for (var ii = 0; ii < grid[i].length; ii++) {
        grid[i][ii].checkTouch();
      }
  }
  checkForTie();
  return false;
}

function draw() {
  background(255);
  for (var i = 0; i < grid.length; i++)
    for (var ii = 0; ii < grid[i].length; ii++)
      grid[i][ii].show();
      
  // Check for overall win
  var weg = checkOverallWin();
  if (weg[0]) {
    gameOver = true;
    overallWinner = weg[1];
  }
  
  fill(0);
  if (!gameOver)
    text((moves%2 == 0 ? "Green's" : "Red's") + " turn", width/2, 10);
  if (gameOver) {
    text("GAME OVER! " + (overallWinner == p1n ? "Green" : "Red") + " won!", width/2, 10);
    noLoop();
  }
  if (tie) {
    text("GAME OVER! Neither player won!", width/2, 10);
    noLoop();
  }
}


class Grid {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.mg = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    this.selected = true;
    this.bc = [];
    this.gc = [];
    this.bcw = 5;
    this.gcw = 5;
    this.winner = -1;
    this.won = false;
  }
  setColor(bc, gc) {
    this.bc = bc;
    this.gc = gc;
    return this;
  }
  setStrokeWidth(w1, w2) {
    this.bcw = w1;
    this.gcw = w2;
    return this;
  }
  
  checkWin() {
    var wnr = -1;
    wnr = eq(wnr, this.mg[0][0], this.mg[0][1], this.mg[0][2]);
    wnr = eq(wnr, this.mg[1][0], this.mg[1][1], this.mg[1][2]);
    wnr = eq(wnr, this.mg[2][0], this.mg[2][1], this.mg[2][2]);
    wnr = eq(wnr, this.mg[0][0], this.mg[1][0], this.mg[2][0]);
    wnr = eq(wnr, this.mg[0][1], this.mg[1][1], this.mg[2][1]);
    wnr = eq(wnr, this.mg[0][2], this.mg[1][2], this.mg[2][2]);
    wnr = eq(wnr, this.mg[0][0], this.mg[1][1], this.mg[2][2]);
    wnr = eq(wnr, this.mg[0][2], this.mg[1][1], this.mg[2][0]);
    if (wnr == p1n) {
      this.setColor(green, fgreen);
      this.won = true;
      this.winner = wnr;
      this.selected = false;
      return true;
    }
    if (wnr == p2n) {
      this.setColor(red, fred);
      this.won = true;
      this.winner = wnr;
      this.selected = false;
      return true;
    }
    
    return false;
  }
  
  checkTouch() {
    if (!this.won && this.selected) {
      var nx = this.x;
      var ny = this.y;
      for (var i = 0; i < 3; i++) {
        for (var ii = 0; ii < 3; ii++) {
          if (this.mg[i][ii] == p0n && mouseX > nx && mouseX < nx+this.w/3 && mouseY > ny && mouseY < ny+this.h/3) {
            this.mg[i][ii] = (++moves%2 == 0 ? p2n : p1n);
            this.checkWin();
            changeSelected(i, ii);
            return;
          }
          nx += (this.w/3);
        }
        nx = this.x;
        ny += (this.h/3);
      }
    }
  }
  
  show() {    
    noStroke();
    var rc = white;
    for (var i = 0; i < 3; i++)
      for (var ii = 0; ii < 3; ii++)
        if (this.mg[i][ii] != p0n) {
          if (this.mg[i][ii] == p1n) { rc = green; }
          if (this.mg[i][ii] == p2n) { rc = red;   }
          fill(rc[0], rc[1], rc[2]);
          rect(this.x+(this.w/3*ii), this.y+(this.h/3*i), this.w/3, this.h/3);
        }
    
    stroke(this.gc[0], this.gc[1], this.gc[2]);
    strokeWeight(this.gcw);
    line(this.x+this.w/3, this.y, this.x+this.w/3, this.y+this.h);
    line(this.x+this.w/3*2, this.y, this.x+this.w/3*2, this.y+this.h);
    line(this.x, this.y+this.h/3, this.x+this.w, this.y+this.h/3);
    line(this.x, this.y+this.h/3*2, this.x+this.w, this.y+this.h/3*2);
    stroke(this.bc[0], this.bc[1], this.bc[2]);
    strokeWeight(this.bcw);
    line(this.x, this.y, this.x+this.w, this.y);
    line(this.x+this.w, this.y, this.x+this.w, this.y+this.h);
    line(this.x+this.w, this.y+this.h, this.x, this.y+this.h);
    line(this.x, this.y, this.x, this.y+this.h);
    stroke(0);
    strokeWeight(1);
  }
}






function checkForTie() {
  for (var i = 0; i < grid.length; i++)
    for (var ii = 0; ii < grid[i].length; ii++)
      if (grid[i][ii].won == false)
        return false;
  if (!checkOverallWin()[0])
    tie = true;
}

function checkOverallWin() {
  var wnr = -1;
  wnr = eqFlag(wnr, grid[0][0], grid[0][1], grid[0][2]);
  wnr = eqFlag(wnr, grid[1][0], grid[1][1], grid[1][2]);
  wnr = eqFlag(wnr, grid[2][0], grid[2][1], grid[2][2]);
  wnr = eqFlag(wnr, grid[0][0], grid[1][0], grid[2][0]);
  wnr = eqFlag(wnr, grid[0][1], grid[1][1], grid[2][1]);
  wnr = eqFlag(wnr, grid[0][2], grid[1][2], grid[2][2]);
  wnr = eqFlag(wnr, grid[0][0], grid[1][1], grid[2][2]);
  wnr = eqFlag(wnr, grid[0][2], grid[1][1], grid[2][0]);
  return [wnr == p1n || wnr == p2n, wnr];
}

function changeSelected(ni1, ni2) {
  // First change every mini-grid already selected to unselected
  for (var i1 = 0; i1 < grid.length; i1++)
    for (var i2 = 0; i2 < grid[i1].length; i2++)
      if (grid[i1][i2].selected) {
        grid[i1][i2].selected = false;
        grid[i1][i2].setColor(gray, gray);
      }

  var ng = grid[ni1][ni2];
  if (ng.won == false) {
    ng.selected = true;
    ng.setColor(blue, blue);
  }
  else if (ng.won) {
    for (var i1 = 0; i1 < grid.length; i1++)
      for (var i2 = 0; i2 < grid[i1].length; i2++)
        if (!grid[i1][i2].won) {
          grid[i1][i2].selected = true;
          grid[i1][i2].setColor(blue, blue);
        }
  }
}

function eqFlag(originalValue, a, b, c) {
  return (a.winner != p0n && a.winner == b.winner && b.winner == c.winner) ? a.winner : originalValue;
}

function eq(originalValue, a, b, c) {
  return (a != p0n && a == b && b == c) ? a : originalValue;
}
