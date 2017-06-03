const Point = require('./Point');

module.exports = class Segment {
  constructor(p1, p2) {
    if (!(p1 instanceof Point) || !(p2 instanceof Point)) {
      throw new TypeError('Constructor arguments are not instances of Point');
    }

    this.p1 = p1;
    this.p2 = p2;
  }

  get length() {
    return this.p1.distanceFromPoint(this.p2);
  }

  findIntersectionPoint(seg) {
    if (!(seg instanceof Segment)) {
      throw new TypeError('Argument is not instance of Segment');
    }

    const sx1 = this.p1.x;
    const sy1 = this.p1.y;
    const ex1 = this.p2.x;
    const ey1 = this.p2.y;
    const sx2 = seg.p1.x;
    const sy2 = seg.p1.y;
    const ex2 = seg.p2.x;
    const ey2 = seg.p2.y;

    let dx1 = ex1 - sx1;
    let dy1 = ey1 - sy1;
    let dx2 = ex2 - sx2;
    let dy2 = ey2 - sy2;

    let s = (-dy1 * (sx1 - sx2) + dx1 * (sy1 - sy2)) / (-dx2 * dy1 + dx1 * dy2);
    let t = ( dx2 * (sy1 - sy2) - dy2 * (sx1 - sx2)) / (-dx2 * dy1 + dx1 * dy2);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
      return new Point(sx1 + (t * dx1), sy1 + (t * dy1));
    }

    return null;
  }

  toString() {
    return `${this.p1}, ${this.p2}`;
  }

  toArray(pointArray) {
    return pointArray ? [this.p1.toArray(), this.p2.toArray()] : [this.p1.x, this.p1.y, this.p2.x, this.p2.y];
  }
};
