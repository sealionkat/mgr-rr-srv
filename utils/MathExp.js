const MathExp = {
  // expecting that max >= x >= min
  normalize(x, max, min) {
    return (x - min) / (max - min);
  }
};

module.exports = MathExp;
