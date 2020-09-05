/**
 * Data
 * 公式： F(M) = G(M) + H(M);
 */
class Data {
  constructor(point, g, h, parent) {
    this.point = point;
    this.g = g;
    this.h = h;
    this.parent = parent;
  }

  f() {
    return this.g + this.h;
  }
}
