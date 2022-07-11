export class DFS {
  constructor(matrix, coords) {
    this.height = matrix.length
    this.width = matrix[0].length

    this.start = coords.start
    this.end = coords.end
    
    this.stack = [this.start.y * this.width + this.start.x]
    this.pathMap = new Map()

    this.matrix = matrix

    this.visited = Array.from({ length: matrix.length }, () => Array(matrix[0].length).fill(false))
    this.visited[this.start.y][this.start.x] = true
  }
  async * search() {
    const levelSet = new Set()

    top:
    while (this.stack) {
      const currNode = this.stack.at(-1)

      const row = Math.floor(currNode / this.width)
      const col = currNode % this.width

      for (const neighbor of (this.matrix[row][col])) {
        let nRow = row, nCol = col
        
        switch (neighbor) {
          case 'N':
            nRow--
            break

          case 'E':
            nCol++
            break

          case 'S':
            nRow++
            break

          case 'W':
            nCol--
            break
        }

        if (!this.visited[nRow][nCol]) {
          this.visited[nRow][nCol] = true
          
          // Remember path via backwards map (neighbor -> current)
          this.pathMap.set(nRow * this.width + nCol, currNode)

          // Check if we've found our target node
          if (currNode === this.end.y * this.width + this.end.x) return
          
          // Add value to stack and yield updated scope
          this.stack.push(nRow * this.width + nCol)

          // Add visited node to set and yield
          levelSet.add(nRow * this.width + nCol)
          yield levelSet
          
          continue top
        }
      }

      // If we've nothing to visit, then backtrack 
      const nodeToRemove = this.stack.pop()
      levelSet.delete(nodeToRemove)

      yield levelSet
    }
  }
  searchInstant () {
    const instantSet = new Set()

    top:
    while (this.stack) {
      const currNode = this.stack.at(-1)

      const row = Math.floor(currNode / this.width)
      const col = currNode % this.width

      for (const neighbor of (this.matrix[row][col])) {
        let nRow = row, nCol = col
        
        switch (neighbor) {
          case 'N':
            nRow--
            break

          case 'E':
            nCol++
            break

          case 'S':
            nRow++
            break

          case 'W':
            nCol--
            break
        }

        if (!this.visited[nRow][nCol]) {
          this.visited[nRow][nCol] = true
          
          // Remember path via backwards map (neighbor -> current)
          this.pathMap.set(nRow * this.width + nCol, currNode)

          // Check if we've found our target node
          if (currNode === this.end.y * this.width + this.end.x) return instantSet
          
          // Add value to stack and yield updated scope
          this.stack.push(nRow * this.width + nCol)

          // Add visited node to set and yield
          instantSet.add(nRow * this.width + nCol)
          
          continue top
        }
      }

      // If we've nothing to visit, then backtrack 
      const nodeToRemove = this.stack.pop()
      instantSet.delete(nodeToRemove)
    }
  }
  async * buildPath() {
    const path = new Set()
    let lastNode = this.end.y * this.width + this.end.x

    while (lastNode != this.start.y * this.width + this.start.x) {
      path.add(lastNode)
      lastNode = this.pathMap.get(lastNode)

      yield path
    }

    path.add(lastNode)
    yield path
  }
}