import Board from "./Board";

const Numbers = {[-1]:'bomb', 0: 'zero', 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine'};

class Minesweeper {
  timerId;
  constructor(rows,cols,mines) {
    this.board = new Board(rows,cols,mines);
    this.timer = 0;
    this.bombCount = mines;
    this.gameOver = false;
    this.gameStarted = false;
    this.gameWon = false;
  }
  startAt(x,y) {
    this.timerId = setInterval(this.incrementTimer,1000)
    this.board.createBoard(x, y);
    this.gameStarted = true;
    this.update();
  }
  revealCell(x,y) {
    this.gameOver = !this.board.revealCell(x,y);
    console.log('reveal cell: ', x,y);
    if(this.board.revealedCells === this.board.totalCells) {
      this.gameWon = true;
    }
    this.gameOver ? this.endGame() : this.update();
  }
  incrementTimer() {
    this.timer++
  }
  restart() {
    this.gameStarted = false;
    this.gameOver = false;
    this.gameWon = false;
    this.board.restart();
    this.draw();
  }
  endGame(x,y){
    clearInterval(this.timerId);
    this.board.revealBombs();
    this.gameStarted = false;
    this.update();
    alert('game over');
  }
  draw() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    for(let i = 0; i < this.board.rows; i++) {
      let row = document.createElement('div');
      row.classList.add('row');
      for(let j = 0; j < this.board.columns; j++) {
        let cell = document.createElement('div');
        cell.id = `${i}-${j}`;
        cell.classList.add('cell');
        row.appendChild(cell);
      }
      grid.appendChild(row);
    }
  }
  update() {
    for(let i = 0; i < this.board.rows; i++) {
      for(let j = 0; j < this.board.columns; j++) {
        let cell = document.getElementById(`${i}-${j}`);
        cell.classList.remove(...cell.classList);
        cell.classList.add('cell');
        if(this.board.table[i][j].isRevealed) {
          if(this.board.table[i][j].isBomb) {
            cell.classList.add('bomb');
          } else {
            cell.classList.add(Numbers[this.board.table[i][j].value]);
          }
        }
        if(this.board.table[i][j].isFlagged) {
          cell.classList.add('flag');
        }
      }
    }
  }
}

const minesweeper = new Minesweeper(9,9,10);
minesweeper.draw();

const button = document.getElementById('reset');
button.addEventListener('click', () => {
  minesweeper.restart();
})

window.addEventListener('click', (e) => {
  if(e.target.classList.contains('cell') && !minesweeper.gameOver && !minesweeper.gameWon) {
    const [x, y] = e.target.id.split('-').map(Number);
    if (!minesweeper.gameStarted) {
      minesweeper.startAt(x, y);
    } else {
      minesweeper.revealCell(x, y);
    }
  }
  if( minesweeper.gameWon ) {
    alert('You won!');
  }
})

window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  if(e.target.classList.contains('cell') && !minesweeper.gameOver) {
    const [x, y] = e.target.id.split('-').map(Number);
    console.log('flagged cell:', x, y);
    minesweeper.board.flagCell(x,y);
    minesweeper.update();
  }
})
