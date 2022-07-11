class MinIndexedPQ {
  constructor() {
    this.values = []
    this.pm = []
    this.im = []
    this.sz = 0
  }
  insert(ki, value) {
    if (this.contains(ki)) return false

    this.values[ki] = value
    this.pm[ki] = this.sz
    this.im[this.sz] = ki

    this.swim(this.sz++)

    return true
  }
  poll() {
    if (this.isEmpty()) return null

    const top = this.im[0]
    const topVal = this.values[top]
    this.remove(top)

    return top
  }
  remove(ki) {
    if (!this.contains(ki)) return null

    const curr = this.pm[ki]
    this.swap(curr, this.sz - 1)
    this.im.pop()
    this.sz--

    this.sink(curr)
    this.swim(curr)

    this.values[ki] = null
    this.pm[ki] = -1
  }
  update(ki, value) {
    if (!this.contains(ki)) return false

    let curr = this.pm[ki]
    this.values[ki] = value

    this.sink(curr)
    this.swim(curr)

    return true
  }
  decreaseKey(ki, value) {
    if (!this.contains(ki)) return false

    if (this.less(value, this.values[ki])) {
      this.values[ki] = value
      this.swim(this.pm[ki])
    }

    return true
  }
  increaseKey(ki, value) {
    if (!this.contains(ki)) return false

    if (this.less(this.values[ki], value)) {
      this.values[ki] = value
      this.sink(this.pm[ki])
    }

    return true
  }
  swim(curr) {
    let parent = Math.floor(curr / 2)

    while (curr > 0 && this.less(curr, parent)) {
      this.swap(curr, parent)
      curr = parent
      parent = Math.floor(curr / 2)
    }
  }
  sink(curr) {
    while (true) {
      let left = 2 * curr + 1, right = 2 * curr + 2, smallest = left

      if (right < this.sz && this.less(right, left)) smallest = right
      if (left >= this.sz || this.less(curr, smallest)) break

      this.swap(curr, smallest)
      curr = smallest
    }
  }
  swap(curr, parent) {
    const currKey = this.im[curr]
    const parKey = this.im[parent]
    this.pm[currKey] = parent
    this.pm[parKey] = curr

    const temp = this.im[curr]
    this.im[curr] = this.im[parent]
    this.im[parent] = temp
  }
  contains(ki) {
    return this.pm[ki] !== undefined && this.pm[ki] !== -1
  }
  less(curr, parent) {
    return this.values[this.im[curr]] < this.values[this.im[parent]]
  }
  isEmpty() {
    return this.sz === 0
  }
}

export class BestFirst extends MinIndexedPQ {
  constructor(matrix, coords) {
    super()
    this.height = matrix.length
    this.width = matrix[0].length

    this.start = coords.start
    this.end = coords.end
    
    this.map = new Map()

    this.matrix = matrix

    this.travelCost = Array.from({ length: this.height }, () => Array(this.width).fill(Infinity))
    this.travelCost[this.start.y][this.start.x] = 0

    // Method from MinIndexedPQ
    this.insert(this.start.y * this.width + this.start.x, 0)
  }
  async * search() {
    while (!this.isEmpty()) {
      const levelSet = new Set()

      const currNode = this.poll()

      const row = Math.floor(currNode / this.width)
      const col = currNode % this.width

      for (const neighbor of this.matrix[row][col]) {
        let nRow = row, nCol = col

        switch (neighbor) {
          case "N":
            nRow--
            break

          case "E":
            nCol++
            break

          case "S":
            nRow++
            break

          case "W":
            nCol--
            break
        }

        // Calculate Manhattan Distance 
        const manhattan = Math.abs(nRow - this.end.y) + Math.abs(nCol - this.end.x)

        // If Manhattan Distance is cheaper than existing cost
        if (manhattan < this.travelCost[nRow][nCol]) {
          this.travelCost[nRow][nCol] = manhattan

          // Remember path via backwards map (neighbor -> current)
          this.map.set(nRow * this.width + nCol, currNode)

          // Add new node and value to Priority Queue
          if (!this.contains(nRow * this.width + nCol)) {
            this.insert(nRow * this.width + nCol, manhattan)

          } else {
            this.decreaseKey(nRow * this.width + nCol, manhattan)
          }

          // Add value to levelSet and yield updated scope
          levelSet.add(nRow * this.width + nCol)
          yield levelSet

          // Check if we've found our target node
          if (nRow === this.end.y && nCol === this.end.x) return
        }
      }
    }
  }
  searchInstant() {
    const instantSet = new Set()

    while (!this.isEmpty()) {
      const currNode = this.poll()

      const row = Math.floor(currNode / this.width)
      const col = currNode % this.width

      for (const neighbor of this.matrix[row][col]) {
        let nRow = row, nCol = col

        switch (neighbor) {
          case "N":
            nRow--
            break

          case "E":
            nCol++
            break

          case "S":
            nRow++
            break

          case "W":
            nCol--
            break
        }

        // Calculate Manhattan Distance 
        const manhattan = Math.abs(nRow - this.end.y) + Math.abs(nCol - this.end.x)

        // If Manhattan Distance is cheaper than existing cost
        if (manhattan < this.travelCost[nRow][nCol]) {
          this.travelCost[nRow][nCol] = manhattan

          // Remember path via backwards map (neighbor -> current)
          this.map.set(nRow * this.width + nCol, currNode)

          // Add new node and value to Priority Queue
          if (!this.contains(nRow * this.width + nCol)) {
            this.insert(nRow * this.width + nCol, manhattan)

          } else {
            this.decreaseKey(nRow * this.width + nCol, manhattan)
          }

          // Add value to stack and yield updated scope
          instantSet.add(nRow * this.width + nCol)

          // Check if we've found our target node
          if (nRow === this.end.y && nCol === this.end.x) return instantSet
        }
      }
    }
  }
  async * buildPath() {
    const path = new Set()
    let lastNode = this.end.y * this.width + this.end.x

    while (lastNode != this.start.y * this.width + this.start.x) {
      path.add(lastNode)
      lastNode = this.map.get(lastNode)

      yield path
    }

    path.add(lastNode)
    yield path
  }
}
