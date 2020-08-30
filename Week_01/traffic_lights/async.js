async function go() {
  green();

  await sleep(3000);

  yellow();

  await sleep(1000);

  red();
}
