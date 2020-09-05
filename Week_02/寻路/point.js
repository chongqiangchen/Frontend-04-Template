class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  isEqual(value) {
    return this.x === value.x && this.y === value.y;
  }
}
