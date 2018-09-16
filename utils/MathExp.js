const MathExp = {
  // expecting that max >= x >= min
  normalize(x, max, min) {
    return (x - min) / (max - min);
  },
  normalizeGeneral(x, max, min, nmax, nmin) {

  },
  normalizeCurried(max, min) {
    return x => (x - min) / (max - min);
  }
};

module.exports = MathExp;
