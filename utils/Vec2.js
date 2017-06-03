export default class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  get length() {
    return this.distance(new Vec2(0, 0));
  }

  distance(vec) {
    return Math.sqrt(this.distance2(vec));
  }

  distance2(vec) {
    return ((this.x - vec.x) * (this.x - vec.x) + (this.y - vec.y) * (this.y - vec.y));
  }

  add(vec) {
    this.x += vec.x;
    this.y += vec.y;
  }

  sub(vec) {
    this.x -= vec.x;
    this.y -= vec.y;
  }

  scale(s) {
    this.x *= s;
    this.y *= s;
  }
}
