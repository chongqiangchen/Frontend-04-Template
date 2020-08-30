function* go() {
  green();
  yield sleep(3000);
  yellow();
  yield sleep(1000);
  red();
}

function run(interator) {
  let { value, done } = interator.next();
  if (done) return;
  if (value instanceof Promise) {
    value.then(() => {
      run(interator);
    });
  }
}

function co(generator) {
  return function () {
    return run(generator());
  };
}

go = co(go);
