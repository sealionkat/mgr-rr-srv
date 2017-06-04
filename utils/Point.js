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

  static coordsArray2PointsArray(arr) {
    if (!Array.isArray(arr)) {
      throw new TypeError('argument is not an array');
    }
    if (!arr.length) {
      return [];
    }

    const pointsArray = [];
    if (Array.isArray(arr[0])) { // array of coords array
      for (let i = 0; i < arr.length; ++i) {
        pointsArray.push(new Point(arr[i][0], arr[i][1]));
      }
    } else { // array of coords [x1, y1, x2, y2]
      for (let i = 0; i < arr.length; i += 2) {
        pointsArray.push(new Point(arr[i], arr[i + 1]));
      }
    }

    return pointsArray;
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
