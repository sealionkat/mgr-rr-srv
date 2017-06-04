module.exports = class Point {
  constructor(x, y) {
    if (Array.isArray(x)) {
      this.x = x[0];
      this.y = x[1];
    } else {
      this.x = x;
      this.y = y;
    }
  }

  copy() {
    throw new Error('not implemented');
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

  toArray() {
    return [this.x, this.y];
  }
};
