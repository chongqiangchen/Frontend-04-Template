// 简单Test
function isEqual(actualParmas, wantParams, title) {
  if (actualParmas !== wantParams) {
    console.error(title + ': ' + '错误');
    return;
  }
  console.log(title + ': ' + '通过');
}

function isDeepEqual(actualParmas, wantParams, title) {
  if (actualParmas === null || undefined) {
    if (actualParmas !== wantParams) {
      console.error(title + ': ' + '错误');
      return;
    }
    console.log(title + ': ' + '通过');
    return;
  }
  if (actualParmas.toString() !== wantParams.toString()) {
    console.error(title + ': ' + '错误');
    return;
  }
  console.log(title + ': ' + '通过');
}

// test checkPositive 对横向判断
function testCheckPositive1() {
  let chessMap = [
    [1, 1, 1],
    [0, 0, 0],
    [2, 2, 0],
  ];

  return checkPositive(3, (i, j) => chessMap[i][j] !== 1);
}

// test checkPositive 对竖向判断
function testCheckPositive2() {
  let chessMap = [
    [1, 0, 2],
    [1, 2, 0],
    [1, 2, 0],
  ];
  return checkPositive(3, (i, j) => chessMap[j][i] !== 1);
}

// test checkOblique 对正斜判断
function testCheckOblique1() {
  let chessMap = [
    [1, 0, 2],
    [0, 1, 0],
    [0, 2, 1],
  ];
  return checkOblique(3, (i) => chessMap[i][i] !== 1);
}

// test checkOblique 对反斜判断
function testCheckOblique2() {
  let chessMap = [
    [2, 0, 1],
    [0, 1, 0],
    [1, 2, 0],
  ];
  return checkOblique(3, (i) => chessMap[i][2 - i] !== 1);
}

// test willWin
function testWillWin1() {
  let chessMap = [1, 0, 2, 1, 2, 0, 0, 2, 0];
  let chessType = 1;

  return willWin(chessMap, chessType);
}

function testWillWin2() {
  let chessMap = [1, 0, 2, 0, 2, 1, 0, 0, 0];
  let chessType = 1;

  return willWin(chessMap, chessType);
}

// test bestChoice
function testBestChoice1() {
  let chessMap = [2, 0, 0, 0, 1, 0, 0, 0, 0];
  let chessType = 1;

  return bestChoice(chessMap, chessType);
}

function testBestChoice2() {
  let chessMap = [0, 2, 0, 0, 1, 0, 0, 0, 0];
  let chessType = 1;

  return bestChoice(chessMap, chessType);
}

function testBestChoice3() {
  let chessMap = [2, 1, 1, 0, 2, 0, 2, 1, 0];
  let chessType = 1;

  return bestChoice(chessMap, chessType);
}

function main() {
  isEqual(testCheckPositive1(), true, 'testCheckPositive1: 3x3格子 三子棋横向判断');
  isEqual(testCheckPositive2(), true, 'testCheckPositive2: 3x3格子 三子棋竖向判断');
  isEqual(testCheckOblique1(), true, 'testCheckOblique1: 3x3格子 三子棋正斜');
  isEqual(testCheckOblique2(), true, 'testCheckOblique2: 3x3格子 三子棋反斜');
  isDeepEqual(testWillWin1(), [2, 0], 'testWillWin1: 3x3格子 三子棋将会赢');
  isDeepEqual(testWillWin2(), null, 'testWillWin2: 3x3格子 三子棋仍然不确定');
  isDeepEqual(testBestChoice1().result, 0, 'testBestChoice1: 3x3格子 三子棋结果为和局');
  isDeepEqual(testBestChoice2().result, 1, 'testestBestChoice2: 3x3格子 三子棋结果为1方赢');
  isDeepEqual(testBestChoice3().result, -1, 'testestBestChoice3: 3x3格子 三子棋结果为1方输');
}

main();
