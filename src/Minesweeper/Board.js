import Cell from './Cell';

export default class Board {
  neighbors = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  constructor(rows, columns, mines) {
    this.rows = rows;
    this.columns = columns;
    this.mines = mines;
    this.table = [];
    this.revealedCells = 0;
    this.bombPositions = [];
    this.totalCells = rows * columns- mines;
  }
  createBoard(x,y) {
    for (let i = 0; i < this.rows; i++) {
      this.table[i] = [];
      for (let j = 0; j < this.columns; j++) {
        this.table[i][j] = new Cell(i, j);
      }
    }
    this.#placeBombs(x,y);
    this.revealCell(x,y);
  }
  revealCell(x,y) {
    // if x and y is out of bounds, return false
    if (x < 0 || x > this.rows - 1 || y < 0 || y > this.columns - 1) {
      return 1;
    }
    // is flagged ( nothing happens )
    if( this.table[x][y].isFlagged ) {
      return 1;
    }
    if( this.table[x][y].isRevealed ) {
      return 1;
    }
    if( this.table[x][y].isBomb ) {
      return 0;
    }
    // greater than zero ( reveal doar la this specific cell)
    if( this.table[x][y].value > 0 ) {
      this.table[x][y].isRevealed = true;
      this.revealedCells++
      return 1;
    }
    // is zero ( reveal la neighbors )
    this.table[x][y].isRevealed = true;
    this.revealedCells++;
    this.neighbors.forEach( neighbor => {
      this.revealCell(x + neighbor[0], y + neighbor[1]);
    })
    return 1;
  }
  revealBombs() {
    this.bombPositions.forEach(cell => {
      this.table[cell[0]][cell[1]].isRevealed = true;
    })
  }
  flagCell(x,y) {
    if( this.table[x][y].isRevealed ) {
      return;
    }
    this.table[x][y].isFlagged = !this.table[x][y].isFlagged;
  }
  checkForWin() {}
  restart() {
    this.table = [];
    this.bombPositions = [];
    this.revealedCells = 0;
  }
  // Private methods
  #placeBombs(avoidX, avoidY) {
    let bombsPlaced = 0;
    while(bombsPlaced < this.mines) {
      let x = Math.floor(Math.random() * this.rows);
      let y = Math.floor(Math.random() * this.columns);
      if(!this.table[x][y].isBomb && (x < avoidX-1 || x > avoidX+1 || y < avoidY-1 || y > avoidY+1)) {
        this.table[x][y].isBomb = true;
        this.#incrementNeighbors(x,y);
        this.bombPositions.push([x,y]);
        bombsPlaced++
      }
    }
  }
  #incrementNeighbors(x,y) {
    for(let i = 0; i < this.neighbors.length; i++) {
      let neighborX = x + this.neighbors[i][0];
      let neighborY = y + this.neighbors[i][1];
      if(neighborX >= 0 && neighborX < this.rows && neighborY >= 0 && neighborY < this.columns && this.table[neighborX][neighborY].isBomb === false) {
        this.table[neighborX][neighborY].value++;
      }
    }
  }
}