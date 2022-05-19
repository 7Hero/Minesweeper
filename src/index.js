const Numbers = {[-1]:'bomb', 0: 'zero', 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine'};
const bombImg = `<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="12" width="2" height="26" fill="black"/><rect x="26" y="12" width="2" height="26" transform="rotate(90 26 12)" fill="black"/><rect x="8" y="4" width="10" height="18" fill="black"/><rect x="22" y="8" width="10" height="18" transform="rotate(90 22 8)" fill="black"/><rect x="6" y="6" width="14" height="14" fill="black"/><rect x="20" y="4" width="2" height="2" fill="black"/><rect x="20" y="20" width="2" height="2" fill="black"/><rect x="4" y="4" width="2" height="2" fill="black"/><rect x="4" y="20" width="2" height="2" fill="black"/><rect x="8" y="8" width="4" height="4" fill="white"/></svg>`
const flagImg = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect x="16" y="6" width="2" height="19" fill="black"/> <rect x="8" y="22" width="16" height="4" fill="#010000"/> <rect x="12" y="20" width="8" height="2" fill="#010000"/> <rect x="14" y="6" width="4" height="10" fill="#FC0D1B"/> <rect x="10" y="8" width="4" height="6" fill="#FC0D1B"/> <rect x="8" y="10" width="2" height="2" fill="#FC0D1B"/> </svg>`

class Cell {
  constructor(row,col) {
    this.position = {row,col}
    this.isRevealed = false;
    this.isFlagged = false;
    this.isBomb = false;
    this.value = 0;
  }
}

class Board {
  #neighborPositions = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  constructor(rows,cols,bombs) {
      this.ROWS = rows;
      this.COLS = cols;
      this.NUM_BOMBS = bombs;
      this.cells = [];
      this.bombPositions = [];
  }
  #generateMatrix() {
    this.cells = new Array(this.ROWS).fill(0).map((el,row) => new Array(this.COLS).fill(0).map((el,col) => new Cell(row,col)));
  }
  #generateBombPositions(rowIgn,colIgn) {
    while (this.bombPositions.length < this.NUM_BOMBS) {
      let row = Math.floor(Math.random() * this.ROWS);
      let col = Math.floor(Math.random() * this.COLS);
      if (this.cells[row][col].value >= 0 && (row < rowIgn-1 || row > rowIgn+1) || (col < colIgn-1 || col > colIgn+1)) {
        this.bombPositions.push([row,col]);
        this.cells[row][col].value = -1;
        this.cells[row][col].isBomb = true;
        this.#increaseNeighborCount(row,col)
      }
    }
  }
  #increaseNeighborCount(row,col) {
    for(let pos of this.#neighborPositions) {
      const neighborRow = row + pos[0], neighborCol = col + pos[1];
      if (neighborRow < 0 || neighborRow >= this.ROWS || neighborCol < 0 || neighborCol >= this.COLS) {
        continue;
      }
      if (this.cells[neighborRow][neighborCol].value >= 0) {
        this.cells[neighborRow][neighborCol].value++;
      }
    }
  }
  generateBoard(row,col) {
    this.#generateMatrix()
    this.#generateBombPositions(row,col);
  }
  revealCell(row,col) {
    console.log(this.cells)
    if (this.cells[row][col].isBomb) {
      return 'GAME OVER';
    }
    if (this.cells[row][col].isRevealed) {
      return 'PLAYING';
    }
    this.#floodFill(row,col);
    this.cells[row][col].isRevealed = true;
    return 'PLAYING';
  }
  #floodFill(row,col) {
    if (row < 0 || row >= this.ROWS || col < 0 || col >= this.COLS) {
      return;
    }
    if(this.cells[row][col].isRevealed) {
      return;
    }
    if(this.cells[row][col].value > 0 || this.cells[row][col].isBomb) {
      // this.cells[row][col].isRevealed = true;
      return;
    }
    this.cells[row][col].isRevealed = true;
    for( let pos of this.#neighborPositions) {
      let neighborRow = row + pos[0];
      let neighborCol = col + pos[1];
      if (neighborRow < 0 || neighborRow >= this.ROWS || neighborCol < 0 || neighborCol >= this.COLS) {
          continue;
      }
      if(this.cells[neighborRow][neighborCol].value > 0 ) {
        this.cells[neighborRow][neighborCol].isRevealed = true;
      }
    }
    this.#floodFill(row+1,col);
    this.#floodFill(row-1,col);
    this.#floodFill(row,col+1);
    this.#floodFill(row,col-1);
  }
  reset() {
    this.cells = [];
    this.bombPositions = [];
  }
}

class Game {
  constructor(rows,cols,bombs) {
    this.board = new Board(rows,cols,bombs);
    this.timer = 0;
    this.intervalId = null;
    this.state = 'INITIALIZING';
    this.gameOverCell = {row: null, col: null};
    this.revealedCells = 0;
  }
  init(row,col) {
    this.board.generateBoard(row,col);
    this.state = this.board.revealCell(row,col);
    this.intervalId = setInterval(() => {
      this.timer++;
    }, 1000);
  }
  revealCell(row,col){
    if(this.board.revealCell(row,col) === 'GAME OVER') {
      this.gameOver(row,col);
      return false
    }
    return true;
  }
  drawGrid() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    for (let i = 0; i < this.board.ROWS; i++) {
      let row = document.createElement('div');
      row.classList.add('row');
      for (let j = 0; j < this.board.COLS; j++) {
        let cell = document.createElement('div');
        cell.id = `${i}-${j}`;
        // cell.textContent = this.board.cells[i][j].value;
        cell.classList.add('cell');
        row.appendChild(cell);
      }
      grid.appendChild(row);
    }
  }
  updateGrid(){
    for (let i = 0; i < this.board.ROWS; i++) {
      for (let j = 0; j < this.board.COLS; j++) {
        let cell = document.getElementById(`${i}-${j}`);
        if(this.board.cells[i][j].isRevealed) {
          if(!this.board.cells[i][j].isBomb) {
            cell.textContent = this.board.cells[i][j].value;
          } else {
            cell.innerHTML = bombImg;
          }
          cell.classList.add(Numbers[this.board.cells[i][j].value]);
        }
        if(this.board.cells[i][j].isFlagged) {
          cell.innerHTML = flagImg;
        }
        // cell.classList.remove(Numbers[matrix[i][j].value]);
      }
    }
    if(this.gameOverCell.row !== null && this.gameOverCell.col !== null) {
      document.getElementById(`${this.gameOverCell.row}-${this.gameOverCell.col}`).classList.add('game-over');
    }
  }
  flag(row,col) {
    this.board.cells[row][col].isFlagged = true;
  }
  reveal(row,col) {
    for(let row of this.board.cells) {
      for(let cell of row) {
        if(cell.isBomb) {
          cell.isRevealed = true;
        }
      }
    }
    this.gameOverCell ={row,col};
  }
  gameOver(row,col) {
    clearInterval(this.intervalId);
    this.state = 'GAME OVER';
    this.reveal(row,col);
  }
  reset() {
    this.board.reset();
    this.gameOverCell = {row: null, col: null};
  }
  checkWin() {

  }
}


function initGame(e) {
  if(e.target.classList.contains('cell')) {
    console.log("Game has started");
    let [row,col] = e.target.id.split('-').map(Number);
    game.init(row,col);
    game.updateGrid();
    window.removeEventListener('click',initGame);
    window.addEventListener('click',updateGame);
    window.addEventListener('contextmenu',flag);
  }
}
function flag(e) {
  e.preventDefault();
  if(e.target.classList.contains('cell')) {
    let [row,col] = e.target.id.split('-').map(Number);
    game.flag(row,col);
    game.updateGrid();
  }
}
function updateGame(e) {
  if(e.target.classList.contains('cell')) {
    let [row,col] = e.target.id.split('-').map(Number);
    if(e.which === 1){
      game.revealCell(row,col);
      if(game.state === 'GAME OVER') {
        window.removeEventListener('click',updateGame);
        window.removeEventListener('click',flag);
      }
      game.updateGrid();
    }
  }
}

const game = new Game(9,9,10);

game.drawGrid();
window.addEventListener('click', initGame);

document.getElementById('reset_btn').addEventListener('click', () => {
  game.reset();
  game.drawGrid();
  window.removeEventListener('click',updateGame);
  window.addEventListener('click', initGame);
});


