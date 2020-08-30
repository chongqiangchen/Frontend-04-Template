const lightIndexMap = {
  GREEN: 0,
  YELLOW: 1,
  RED: 2,
};
const lightColorMap = {
  GREEN: 'green',
  YELLOW: 'yellow',
  RED: 'red',
  NONE: 'grey',
};

const itemList = document.querySelectorAll('.item');

function clearAll() {
  itemList.forEach((item) => {
    item.style.background = lightColorMap.NONE;
  });
}

function green() {
  clearAll();
  itemList[lightIndexMap.GREEN].style.background = lightColorMap.GREEN;
}

function red() {
  clearAll();
  itemList[lightIndexMap.RED].style.background = lightColorMap.RED;
}

function yellow() {
  clearAll();
  itemList[lightIndexMap.YELLOW].style.background = lightColorMap.YELLOW;
}

function sleep(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}
