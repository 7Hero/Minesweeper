export default class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this._isBomb = false;
    this.isRevealed = false;
    this.isFlagged = false;
    this.value = 0;
  }
  set isBomb(value) {
    this._isBomb = value;
    this.value = -1;
  }
  get isBomb() {
    return this._isBomb;
  }
}