function go() {
  green();
  setTimeout(() => {
    yellow();
    setTimeout(() => {
      red();
    }, 1000);
  }, 3000);
}
