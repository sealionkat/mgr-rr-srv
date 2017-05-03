const geo = {
  intersectionDetect(seg1, seg2) {
    if (typeof seg1 === 'undefined' || typeof seg2 === 'undefined') {
      throw new Error('lack of segment');
    }

    const sx1 = seg1[0];
    const sy1 = seg1[1];
    const ex1 = seg1[2];
    const ey1 = seg1[3];
    const sx2 = seg2[0];
    const sy2 = seg2[1];
    const ex2 = seg2[2];
    const ey2 = seg2[3];

    let dx1 = ex1 - sx1;
    let dy1 = ey1 - sy1;
    let dx2 = ex2 - sx2;
    let dy2 = ey2 - sy2;

    let s = (-dy1 * (sx1 - sx2) + dx1 * (sy1 - sy2)) / (-dx2 * dy1 + dx1 * dy2);
    let t = ( dx2 * (sy1 - sy2) - dy2 * (sx1 - sx2)) / (-dx2 * dy1 + dx1 * dy2);

    return s >= 0 && s <= 1 && t >= 0 && t <= 1;
  },
  distance(p1, p2) {
    return Math.sqrt((p1[0] - p2[0]) * (p1[0] - p2[0]) + (p1[1] - p2[1]) * (p1[1] - p2[1]));
  },
  intersectionPoint(seg1, seg2) {
    if (typeof seg1 === 'undefined' || typeof seg2 === 'undefined') {
      throw new Error('lack of segment');
    }

    const sx1 = seg1[0];
    const sy1 = seg1[1];
    const ex1 = seg1[2];
    const ey1 = seg1[3];
    const sx2 = seg2[0];
    const sy2 = seg2[1];
    const ex2 = seg2[2];
    const ey2 = seg2[3];

    let dx1 = ex1 - sx1;
    let dy1 = ey1 - sy1;
    let dx2 = ex2 - sx2;
    let dy2 = ey2 - sy2;

    let s = (-dy1 * (sx1 - sx2) + dx1 * (sy1 - sy2)) / (-dx2 * dy1 + dx1 * dy2);
    let t = ( dx2 * (sy1 - sy2) - dy2 * (sx1 - sx2)) / (-dx2 * dy1 + dx1 * dy2);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
      return [sx1 + (t * dx1), sy1 + (t * dy1)];
    }

    return null;
  }
};

module.exports = geo;
