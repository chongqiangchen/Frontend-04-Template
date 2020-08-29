const CONDITION_OF_WIN = 3;

// 检查输赢, 不考虑长宽不一致情况
function check(chessMap, chessType, Len = CONDITION_OF_WIN) {
  if (checkPositive(Len, (i, j) => chessMap[j * Len + i] !== chessType)) return true;
  if (checkPositive(Len, (i, j) => chessMap[i * Len + j] !== chessType)) return true;
  if (checkOblique(Len, (i) => chessMap[i * Len + i] !== chessType)) return true;
  if (checkOblique(Len, (i) => chessMap[i * Len + 2 - i] !== chessType)) return true;

  return false;
}

function willWin(chessMap, chessType, Len = CONDITION_OF_WIN) {
  for (let i = 0; i < Len; i++) {
    for (let j = 0; j < Len; j++) {
      if (chessMap[i * Len + j]) continue;

      let temp = clone(chessMap);
      temp[i * Len + j] = chessType;
      if (check(temp, chessType)) {
        return [i, j];
      }
    }
  }
  return null;
}

function bestChoice(chessMap, chessType, Len = CONDITION_OF_WIN) {
  let p;

  if ((p = willWin(chessMap, chessType))) {
    return {
      point: p,
      result: 1,
    };
  }

  let myResult = -2; // 初始值-2（无意义）， -1 输， 0 和局， 1 赢
  let point = null;
  for (let i = 0; i < Len; i++) {
    for (let j = 0; j < Len; j++) {
      if (chessMap[i * Len + j]) continue;
      let temp = clone(chessMap);
      temp[i * Len + j] = chessType;
      // 找到对手的最优点和结果
      let enemyResult = bestChoice(temp, Len - chessType).result;
      // 当我方现有的结果 没有 预估出来的结果好（敌方反向的结果是我方即将面临的结果），就存为新的结果
      // 简单说： 存一个最优结果值
      if (myResult < -enemyResult) {
        myResult = -enemyResult;
        point = [i, j];
      }
    }
  }
  return {
    point: point,
    result: point ? myResult : 0,
  };
}
