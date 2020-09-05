function sleep(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

function findDeep() {
  let idx = 0;
  const result = arr.filter((item, index) => {
    idx = index;
    return JSON.stringify(item.point) === JSON.stringify(point);
  });
  return {
    data: result[0],
    index: idx,
  };
}

function hManhattanDistance(pnt, end) {
  // 欧式距离,小于等于实际值
  // return Math.sqrt(Math.pow(pnt.x - end.x, 2) + Math.pow(pnt.y - end.y, 2));
  // 曼哈顿距离,小于等于实际值
  // return Math.abs(pnt.x - end.x) + Math.abs(pnt.y - end.y);
  // BFS的h值,恒为0
  return 0;
}
