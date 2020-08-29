function clone(value) {
  return Object.create(value);
}

function drawChess(el, value) {
  el.innerText = getChess(value);
}

function drawChessWithXY(x, y, value) {
  const id = `${x}_${y}`;
  drawChess(document.getElementById(id), value);
}

function getChess(value) {
  return value === 2 ? '×' : value === 1 ? 'o' : '';
}

function getXY(target) {
  return {
    x: +target.id.split('_')[0],
    y: +target.id.split('_')[1],
  };
}

function checkPositive(len, callback) {
  for (let i = 0; i < len; i++) {
    let isWin = true;
    for (let j = 0; j < len; j++) {
      if (callback(i, j)) {
        isWin = false;
      }
    }

    if (isWin) {
      return true;
    }
  }
  return false;
}

function checkOblique(len, callback) {
  let isWin = true;
  for (let i = 0; i < len; i++) {
    if (callback(i)) {
      isWin = false;
    }
  }
  return isWin;
}
