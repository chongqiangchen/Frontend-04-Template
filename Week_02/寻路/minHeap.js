class MinHeap {
  queue = [];
  index = new WeakMap();

  get() {
    if (this.isEmpty()) {
      return null;
    }
    let head = this.queue[0];
    let last = this.queue[this.queue.length - 1];
    this.queue[0] = last;
    this.queue.pop();
    this.index.delete(head.point);

    this.topDown();
    return head;
  }

  set(data) {
    this.queue.push(data);
    this.index.set(data.point, data);

    this.bottomUp();
  }

  find(point) {
    return this.index.get(point);
  }

  isEmpty() {
    return this.queue.length <= 0;
  }

  size() {
    return this.queue.length;
  }

  topDown() {
    let cur = 0;
    let len = this.queue.length;
    while (cur < len) {
      let left = 2 * cur + 1;
      let right = 2 * cur + 2;

      let dc = this.queue[cur];
      let dl = left < len ? this.queue[left] : null;
      let dr = right < len ? this.queue[right] : null;

      let next = -1;
      let dn = dc;
      if (dl !== null && dl.f() < dn.f()) {
        next = left;
        dn = dl;
      }
      if (dr != null && dr.f() < dn.f()) {
        next = right;
        dn = dr;
      }

      if (next >= 0 && next < len) {
        this.queue[next] = dc;
        this.queue[cur] = dn;
        cur = next;
      } else {
        break;
      }
    }
  }

  bottomUp() {
    const len = this.queue.length;
    let cur = len - 1;
    while (cur >= 0) {
      let parent = Math.floor((cur - 1) / 2);
      if (parent < 0) {
        break;
      }
      let dc = this.queue[cur];
      let dp = this.queue[parent];

      if (dc.f() < dp.f()) {
        this.queue[parent] = dc;
        this.queue[cur] = dp;
        cur = parent;
      } else {
        break;
      }
    }
  }
}
