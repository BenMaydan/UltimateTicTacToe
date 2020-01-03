var moves = 0;
var grid = [[], [], []];
var p0n;
var p1n;
var p2n;
let sBetween = 15;

let white;
let red;
let green;
let blue;
let black;

var tie;
var gameOver;
var overallWinner;

var onMenu = true;
var otherPlayer = "";
let menu;
let undo;
let resume;
let newGameHH;
let newGameHC;
var gameStates = [];

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.mousePressed(cnvMousePressed);
  
  menu = createButton("Menu");
  menu.position(10, 10);
  menu.mousePressed(goToMenu);
  undo = createButton("Undo");
  undo.position(70, 10);
  undo.mousePressed(undoGameState);
  menu.hide();
  undo.hide();
  
  resume = createButton("Resume Game");
  resume.position(width/2, height/2-10);
  resume.center("horizontal");
  resume.mousePressed(resumeGame);
  newGameHH = createButton("New Game {Human:Human}");
  newGameHH.position(width/2, height/2+10);
  newGameHH.center("horizontal");
  newGameHH.mousePressed(createNewGameHH);
  //newGameHC = createButton("New Game {Human:Human}");
  //newGameHC.position(width/2, height/2+10);
  //newGameHC.center("horizontal");
  //newGameHC.mousePressed(resetGame);
  
  
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
  overallWinner = -1;
  
  var w = width/5;
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  if (key == 'e' || keyCode == ESC)
    fullscreen(!fullscreen());
}

function cnvMousePressed() {
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
  if (!onMenu) {
    for (var i = 0; i < grid.length; i++)
      for (var ii = 0; ii < grid[i].length; ii++)
        grid[i][ii].show();
    
    fill(0);
    if (tie) {
      text("GAME OVER! Neither player won!", width/2, 10);
    } if (gameOver) {
      text("GAME OVER! " + (overallWinner == p1n ? "Green" : "Red") + " won!", width/2, 10);
    } else {
      text((moves%2 == 0 ? "Green's" : "Red's") + " turn", width/2, 10);
    }
  }
  else
    text("Ultimate Tic Tac Toe", width/2, 10);
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
  setSelected(onOff) {
    this.selected = onOff;
    return this;
  }
  
  deepCopy() {
    let ng = new Grid(this.x, this.y, this.w, this.h).setColor(this.bc, this.gc).setStrokeWidth(this.bcw, this.gcw).setSelected(this.selected);
    var nmg = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    for (var img = 0; img < this.mg.length; img++)
      for (var iimg = 0; iimg < this.mg[img].length; iimg++)
        nmg[img][iimg] = this.mg[img][iimg];
    ng.mg = nmg;
    ng.winner = this.winner;
    ng.won = this.won;
    return ng;
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
            // Deep copy new grid
            var ngrid = [[], [], []];
            for (var ig = 0; ig < grid.length; ig++)
              for (var iig = 0; iig < grid[ig].length; iig++)
                ngrid[ig].push(grid[ig][iig].deepCopy());
            gameStates.push([ngrid, moves]);
            // End deep copy new grid
            this.mg[i][ii] = (++moves%2 == 0 ? p2n : p1n);
            this.checkWin();
            checkOverallWin();
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






function hideMenuShowGameElements() { resume.hide(); newGameHH.hide(); /*newGameHC.hide();*/ menu.show(); undo.show(); }
function showMenuHideGameElements() { resume.show(); newGameHH.show(); /*newGameHC.show();*/ menu.hide(); undo.hide(); }
function createNewGameHH()  { otherPlayer = "human";    onMenu = false; hideMenuShowGameElements(); }
function createNewGameHC()  { otherPlayer = "computer"; onMenu = false; hideMenuShowGameElements(); }

function saveGame() {
  let grid_json_string = JSON.stringify();
  let gameDict = createStringDict({"moves":moves, "grid_json_string":grid_json_string, "tie":tie, "gameOver":gameOver, "overallWinner":overallWinner});
}

function resumeGame() {
  
}

function goToMenu() {
  // TODO Store current game
  onMenu = true;
  saveGame();
  showMenuHideGameElements();
  moves = 0;
  grid = [[], [], []];
  var w = width/5;
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
  tie = false;
  gameOver = false;
  overallWinner = -1;
}

function undoGameState() {
  if (gameStates.length > 0) {
    grid = gameStates[gameStates.length-1][0];
    moves = gameStates[gameStates.length-1][1];
    gameStates.pop();
    if (gameOver || tie) {
      gameOver = false;
      tie = false;
      overallWinner = -1;
    }
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
  if (wnr == p1n || wnr == p2n) {
    gameOver = true;
    overallWinner = wnr;
  }
}

function changeSelected(ni1, ni2) {
  if (!gameOver) {
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
}

function eqFlag(originalValue, a, b, c) { return (a.winner != p0n && a.won && b.won && c.won && a.winner == b.winner && b.winner == c.winner) ? a.winner : originalValue; }
function eq(originalValue, a, b, c) { return (a != p0n && a == b && b == c) ? a : originalValue; }
