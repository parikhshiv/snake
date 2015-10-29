(function (){
  if (typeof Game === 'undefined') {
    var Game = window.Game = {};
  }

  function Snake() {
    this.dir = [0, -1];
    this.segments = [[5,5]];

  }

  Snake.prototype.addTwoCoords = function (coord1, coord2) {
    return [[coord1[0]+ coord2[0]], [coord1[1]+ coord2[1]]];
  };

  Snake.prototype.equals = function (coord1, coord2) {
    return coord1[0]===coord2[0] && coord1[1] === coord2[1];
  };

  // Snake.prototype.isOpposite = function (coord1, coord2) {
  //
  // };

  Snake.prototype.move = function () {
    this.segments = this.segments.map ( function(el){
      this.addTwoCoords(el, this.dir);
    });
  };

  Snake.prototype.turn = function (dir) {
    this.dir = dir;
  };

  var Board = window.Game.Board = function() {
    this.grid = [];
    this.snake = new Snake();
    this.render();
  };

  Board.prototype.render = function () {
    for (var i = 0; i < 8; i++) {
      this.grid.push([]);
      for (var j = 0; j < 8; j++) {
        this.grid[i].push(".");
      }
    }

    this.snake.segments.forEach(function(el) {
      this.grid[el[0]][el[1]] = "S";
    });
    return this.grid;
  };

})();
