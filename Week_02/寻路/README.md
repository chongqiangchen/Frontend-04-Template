1.  绘制地图
2.  明确边界值： - 超出边界和小于 0 的 - Map 标识为 1 表示障碍物，需排除 - Map 标识为 2 表示已走过，需排除
3.  理清思路：

    1.  我们需要先了解广度和深度优先搜索算法，我们可以看图，
        _深度优先搜索_： 会不断向一个地方走，直到遇到障碍物才会回溯，
        如下图，我们如果初始向右查找，它会先找到底部再回溯，用代码简单形容就是：

        ```
          // 使用递归或者堆栈处理（先进后出）
          const stack = [start];
          function insert(point) {
          // 排除边界情况·
          ...
          // 将新的左标放入列表
          stack.push(point)
          }

          while(queue.length) {
          const point = stack.pop()

            insert(point) //右
            insert(point) //下
            insert(point) //左
            insert(point) //上

          }
        ```

        _广度优先算法_： 可以想象地震波，一层一层向外，我觉得这个比喻很形象，一般处理就是队列（先进先出），如下图：
        (img)
        代码简单形容：

        ```
          // 使用递归或者堆栈处理（先进后出）
          const queue = [start];
          function insert(point) {
          // 排除边界情况
          ...
          // 将新的左标放入列表
          queue.push(point)
          }

          while(queue.length) {
            const point = queue.shift()

            insert(point) //右
            insert(point) //下
            insert(point) //左
            insert(point) //上
          }
        ```

        两者的问题：

        - 深度优先算法： 不一定能找到最优解，并且非常耗时，每次都是不见棺材不掉泪的找
        - 广度： 可以找到最优解，原因是每次都是先找离初始点最近的位置进行扩散性查找，但是时间长，会把可能与不可能都算进去

    2.  那么如何改进广度算法呢，其实就是让计算机明确找的位置，也就是说每次如若能看看远方，找到目标值与当前位置的距离，这样不就是给了计算机一个明确的方向找嘛
        但是，只看远方肯定不够的，我们还是需要回头在看看到出发点的距离，是不是有更近路到达当前位置。
    3.  简单总结：
        1. 明确几个常量：M 为当前位置， G(M)表示出发点到 M，H 表示 M 到目标值的估值（原因我们无法确认中间是否有障碍物），F 表示从起点 S 到终点 E 经过 M 的距离 ，得到公示 F(M) = G(M) + H(M)
        2. 每一格子有 8 个方向，从中找到目标值和 M（当前位置）的最短距离的那个方向
        3. 确认该位置 Point 是否存在于已有的队列中， - 如果存在，则利用 G(M)判断是否优于先前值，如若优于则重新存放该位置对应的 parent，和 G（M） - 如果不存在： 则存放新的数据到队列中：F,G,H, parent
        4. 确保每次从队列拿出的值为最小值（利用 F(M)进行判断），进行启发式搜索

4.  理清思路后我们开始：

    1. 构建几个数据结构：

    - Point: 记录点的情况

    ```
      class Point() {
        constructor(x, y) {
        this.x = x;
        this.y = y;
       }
    }
    ```

    - Data: 用于存储于队列中的数据

    ```
      class Data() {
        constructor(point, g, h, parent) {
          this.point = point;
          this.g = g;
          this.h = h;
          this.parent = parent;
        }

        f() {
          return this.g + this.h;
        }
      }
    ```

    2. G 其实我们是可以获知的，在每走一步（分直着走和斜着走）去的是时候进行增量，确保 M（当前位置）距离出发点的位置被正确记录，直走：1，斜走：约等于 1.4
       (img)
       可以看到斜走与直走的一步并不一致，故直走为 1， 斜走则为 2 的开方约等于 1.4
       ```
        const G_STRAIGHT = 1.0;
        const G_OBLIQUE = 1.4;
       ```
    3. 获取 H(M)的时候我们需要考虑 3 种情况：

       1. 估值 h 和实际 h’相等，那么我们每次搜索的每一步之后我们能够明确判断到哪个是最优解，最短路径，基本不需要扩展搜索了
       2. 估值 h 小于实际 h’： 我们到最后一定能找到一条最短路径(如果存在另外一条更短的评估路径，就会选择更小的那个)，但是有可能会经过很多无效的点，广度搜索其实就是这个的极端，估值 h 为 0， F(M) = G(M)
       3. 估值 h 大于实际 h’： 我们可能会很快的找到对应的最优路径，但并不一定是最短路径
       4. 总结： A\* \*算法最后留给我们的，就是在时间和距离上需要考虑的一个平衡，而我们将使用欧氏距离计算（小于实际值）

       ```
         return Math.sqrt(Math.pow(pnt.x - end.x, 2) + Math.pow(pnt.y - end.y, 2));
       ```

5.  核心代码：

    ```
      const OBSTACLES = 1;
      const VISITED = 2;
      const G_STRAIGHT = 1.0;
      const G_OBLIQUE = 1.4;

      async function findPath(Map, start, end) {
    	const startPoint = new Point(start[0], start[1]);
    	const endPoint = new Point(end[0], end[1]);
    	const startData = new Data(startPoint, 0, 0, null);
    	const queue = new SortedQueue([startData], (a, b) => a.f() - b.f());

    	async function insert(x, y, curData, distOfG) {
    	  // 省略边界情况
    	  const point = new Point(x, y);
    	  const oldData = queue.find(point).data;

    	  // 标记访问过
    	  Map[100 * y + x] = VISITED;

    	  // 如果队列中存在该点相关的data
    	  if (oldData) {
    		// 判断G：离起始点距离
    		if (oldData.g > curData.g + distOfG) {
    		  oldData.g = curData.g + distOfG;
    		  oldData.parent = curData;
    		}
    	  } else {
    		// 记录新数据
    		const h = hManhattanDistance(point, endPoint);
    		const data = new Data(point, curData.g + distOfG, h, curData);
    		queue.enqueue(data);
    	  }
    	}

    	while (queue.size()) {
    	  const data = queue.dequeue();
    	  const { x, y } = data.point;

    	  if (x === end[0] && y === end[1]) {
    		const path = [];
    		// 反向找出路径
    		for (let pathData = data; pathData != null; ) {
    		  const pnt = pathData.point;
    		  path.push(pnt);
    		  board.children[100 * pnt.y + pnt.x].style.backgroundColor = 'red';
    		  pathData = pathData.parent;
    		}
    		console.log(path);
    		return;
    	  }

    	  // 找四个方向， 直走用G_STRAIGHT， 斜走用G_OBLIQUE
    		...
    	}
    }
    ```
