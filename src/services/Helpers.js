export const between = function between (x, min, max) {
  return x >= min && x <= max
}

export const returnLimit = function (x, min, max) {
  if (x < min) {
    return min
  } else if (x > max) {
    return max
  } else {
    return x
  }
}
