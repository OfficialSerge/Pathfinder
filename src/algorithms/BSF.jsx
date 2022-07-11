export class BFS {
  constructor(matrix, coords) {
    this.height = matrix.length
    this.width = matrix[0].length

    this.start = coords.start
    this.end = coords.end

    this.pathMap = new Map()

    this.matrix = matrix

    this.visited = Array.from({ length: matrix.length }, () => Array(matrix[0].length).fill(false))
    this.visited[this.start.y][this.start.x] = true
  }
  async * search() {
    let level = [this.start.y * this.width + this.start.x]

    while (!this.visited[this.end.y][this.end.x]) {
      const nextLevel = [], levelSet = new Set()

      for (const currNode of level) {
        const row = Math.floor(currNode / this.width)
        const col = currNode % this.width

        for (const neighbor of this.matrix[row][col]) {
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

            // Visit neighbor and add to levelSet
            this.visited[nRow][nCol] = true
            levelSet.add(nRow * this.width + nCol)

            // Add neighbor to the next level's worth of nodes to consider
            nextLevel.push(nRow * this.width + nCol)

            // Remember path via backwards map (neighbor -> current)
            this.pathMap.set(nRow * this.width + nCol, currNode)
          }
        }

        // Set level equal to nextLevel and process again
        level = [...nextLevel]
      }
      yield levelSet
    }
    return
  }
  searchInstant() {
    let level = [this.start.y * this.width + this.start.x], instantSet = new Set()

    while (!this.visited[this.end.y][this.end.x]) {
      const nextLevel = []

      for (const currNode of level) {
        const row = Math.floor(currNode / this.width)
        const col = currNode % this.width

        for (const neighbor of this.matrix[row][col]) {
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

            // Visit neighbor and add to instantSet
            this.visited[nRow][nCol] = true
            instantSet.add(nRow * this.width + nCol)

            // Add neighbor to the next level's worth of nodes to consider
            nextLevel.push(nRow * this.width + nCol)

            // Remember path via backwards map (neighbor -> current)
            this.pathMap.set(nRow * this.width + nCol, currNode)
          }
        }
      }

      // Set level equal to nextLevel and process again
      level = [...nextLevel]
    }
    return instantSet
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