var sum_to_n_a = function (n) {
  return (n * (n + 1)) / 2;
};

var sum_to_n_b = function (n) {
  let sum = 0;

  for (i = 1; i <= n; i++) {
    sum += i;
  }

  return sum;
};

var sum_to_n_c = function (n) {
  return n !== 0 ? n + sum_to_n_c(n - 1) : n;
};
