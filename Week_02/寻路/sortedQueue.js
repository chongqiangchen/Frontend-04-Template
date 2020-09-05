class SortedQueue {
  constructor(data, compare) {
    this.queue = data.slice();
    this.compare = compare || ((a, b) => a - b);
  }

  dequeue() {
    if (this.isEmpty()) return;
    let min = this.queue[0];
    let minIndex = 0;

    for (let i = 1; i < this.queue.length; i++) {
      if (this.compare(this.queue[i], min) < 0) {
        min = this.queue[i];
        minIndex = i;
      }
    }

    // 事实上我们并不需要让队列真的排序好，只需要确保我们每次拿出来的时候是最小值
    this.queue[minIndex] = this.queue[this.queue.length - 1];
    this.queue.pop();
    return min;
  }

  enqueue(v) {
    this.queue.push(v);
  }

  size() {
    return this.queue.length;
  }

  isEmpty() {
    return !this.size();
  }

  find(point) {
    let idx = 0;
    const result = this.queue.filter((item, index) => {
      idx = index;
      return JSON.stringify(item.point) === JSON.stringify(point);
    });
    return {
      data: result[0],
      index: idx,
    };
  }
}
