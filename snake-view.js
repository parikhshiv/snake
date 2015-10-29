(function (){
  if (typeof Game === 'undefined') {
    var Game = window.Game = {};
  }

  var LOSE_MESSAGES = ["Don't reach, young blood. Don't reach.",
  "Too easy out here against these young bloods.",
  "These hippidy hop young bloods just don't practice the fundamentals.",
  "HE GOT HOSPITAL SHOES ON."
  ];

  var View = window.Game.View = function(board, $el) {
    this.$el = $el;
    this.board = board;
    this.paused = "first";
    $(window).on("keydown", this.handleKeyEvent.bind(this));
    setInterval(this.step.bind(this), 50);
  };

  View.prototype.step = function () {
    if (this.board.lives > 0){
      if (this.paused === "first") {
        this.$el.html("<h3>Press any key to start.</h3>" + "<pre>" + this.board.render() + "</pre>");
      } else if (this.paused){
        this.$el.html("<h3>Game Paused.</h3>" + "<pre>" + this.board.render() + "</pre>");
      }
      else {
        this.board.snake.move();
        this.$el.html("<h3>Apples Eaten: " + this.board.snake.apples + " - Lives Remaining: " + this.board.lives + "</h3>" + "<pre>" + this.board.render() + "</pre>");
      }
    }
  };

  View.prototype.togglePause = function () {
    this.paused = !this.paused;
  };

  View.prototype.handleKeyEvent = function (e) {
    e.preventDefault();
    var key = e.keyCode;
    if (key === 80) {
      this.togglePause();
    } else {
      this.paused = false;
      if (key === 38) {
        this.board.snake.turn([-1,0]);
      } else if (key === 40) {
        this.board.snake.turn([1,0]);
      } else if (key === 37) {
        this.board.snake.turn([0,-1]);
      } else if (key === 39) {
        this.board.snake.turn([0,1]);
      }
    }
  };

  function Snake(board) {
    this.dir = [0, -1];
    this.segments = [[5,4]];
    this.justLeft = [0,0];
    this.board = board;
    this.apples = 0;
  }

  Snake.prototype.addTwoCoords = function (coord1, coord2) {
    var length1 = parseInt(coord1[0])+ parseInt(coord2[0]);
    var length2 = parseInt(coord1[1])+ parseInt(coord2[1]);
    return [[(length1 + 18) % 18], [(length2 + 18) % 18]];
  };

  Snake.prototype.equals = function (coord1, coord2) {
    return coord1[0]===coord2[0] && coord1[1] === coord2[1];
  };

  Snake.prototype.move = function () {
    var that = this;
    this.segments.unshift(this.addTwoCoords(this.segments[0], that.dir));
    this.justLeft = this.segments.pop();
    this.handleGame();
  };

  Snake.prototype.handleGame = function () {
    if (this.board.grid[this.segments[0][0]]
      [this.segments[0][1]] === "<div class='apple'>🍎</div>") {
      this.apples += 1;
      this.segments.push(this.justLeft);
      this.segments.push(this.justLeft);
      this.board.placeApple();
      if ((this.segments.length - 1) % 12 === 0 ) {
        this.board.placeStar();
      }
      if ((this.segments.length - 1) % 6 === 0) {
        this.board.placeHole();
      }
    } else if (this.board.grid[this.segments[0][0]]
      [this.segments[0][1]] === "<div class='snake'></div>") {
        this.board.lives -= 1;
        if (this.board.lives === 0) {
          alert(LOSE_MESSAGES[Math.floor(Math.random()*4)]);
          location.reload();
        } else {
          alert("You just died. You have " + this.board.lives + " lives remaining.");
          this.dir = [0, -1];
          this.segments = [[5,4]];
          this.justLeft = [0,0];
          this.board.grid = [];
          this.board.setupBoard();
          this.board.render();
        }
    } else if (this.board.grid[this.segments[0][0]]
      [this.segments[0][1]] === "<div class='star'>🌟</div>") {
        this.board.lives += 1;
    } else if (this.board.grid[this.segments[0][0]]
      [this.segments[0][1]] === "<div class='hole'>🐍</div>") {
        this.apples = 1;
    } else if (this.apples === 30) {
      alert("Basketball isn't a game; It's an art form. " +
      "You can master the fundamentals so you can forget 'em, " +
      "so you can improvise and just concentrate on what really matters; " +
      "getting buckets. ");
      location.reload();
    }
  };


  Snake.prototype.turn = function (dir) {
    this.dir = dir;
  };

  var Board = window.Game.Board = function() {
    this.grid = [];
    this.snake = new Snake(this);
    this.setupBoard();
    this.render();
    this.lives = 3;
  };

  Board.prototype.setupBoard = function () {
    var that = this;

    for (var i = 0; i < 18; i++) {
      that.grid.push([]);
      for (var j = 0; j < 18; j++) {
        that.grid[i].push("<div class='empty'></div>");
      }
    }
    this.placeApple();
  };

  Board.prototype.placeApple = function () {
    var randomCoord = [Math.floor(Math.random()*18), Math.floor(Math.random()*18)];
    var randomSquare = this.grid[randomCoord[0]][randomCoord[1]];
    while (this.grid[randomCoord[0]]
      [randomCoord[1]] !== "<div class='empty'></div>") {
        randomCoord = [Math.floor(Math.random()*18), Math.floor(Math.random()*18)];
        randomSquare = this.grid[randomCoord[0]][randomCoord[1]];
      }
    this.grid[randomCoord[0]][randomCoord[1]] = "<div class='apple'>🍎</div>";
  };

  Board.prototype.placeStar = function () {
    var randomCoord = [Math.floor(Math.random()*18), Math.floor(Math.random()*18)];
    var randomSquare = this.grid[randomCoord[0]][randomCoord[1]];
    while (randomSquare !== "<div class='empty'></div>") {
        randomCoord = [Math.floor(Math.random()*18), Math.floor(Math.random()*18)];
        randomSquare = this.grid[randomCoord[0]][randomCoord[1]];
      }
    this.grid[randomCoord[0]][randomCoord[1]] = "<div class='star'>🌟</div>";
  };

  Board.prototype.placeHole = function () {
    var randomCoord = [Math.floor(Math.random()*18), Math.floor(Math.random()*18)];
    var randomSquare = this.grid[randomCoord[0]][randomCoord[1]];
    while (randomSquare !== "<div class='empty'></div>") {
        randomCoord = [Math.floor(Math.random()*18), Math.floor(Math.random()*18)];
        randomSquare = this.grid[randomCoord[0]][randomCoord[1]];
      }
    this.grid[randomCoord[0]][randomCoord[1]] = "<div class='hole'>🐍</div>";
  };

  Board.prototype.render = function () {
    var that = this;

    this.snake.segments.forEach(function(el) {
      that.grid[el[0]][el[1]] = "<div class='snake'></div>";
    });

    this.grid[this.snake.justLeft[0]][this.snake.justLeft[1]] = "<div class='empty'></div>";

    return this.grid.map(function(el){
      return el.join('');
    }).join('\n');
  };

})();
