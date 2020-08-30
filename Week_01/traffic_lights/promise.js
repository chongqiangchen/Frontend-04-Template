function go() {
  green();

  sleep(3000)
    .then(() => {
      yellow();
      return sleep(1000);
    })
    .then(red);
}
