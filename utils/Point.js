module.exports = class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  distanceFromPoint(p) {
    return Math.sqrt(this.distanceFromPoint2(p));
  }

  distanceFromPoint2(p) {
    return ((this.x - p.x) * (this.x - p.x) + (this.y - p.y) * (this.y - p.y));
  }

  toString() {
    return `(${this.x}, ${this.y})`;
  }
};
