export class MazeGenerator {
  constructor(rows, cols) {
    this.deltaX = [1, 0, -1, 0]
    this.deltaY = [0, 1, 0, -1]

    this.rows = rows
    this.cols = cols

    this.stackX = [0]
    this.stackY = [0]

    this.visited = 1

    this.GRID = Array.from({ length: this.rows }, () => Array(this.cols).fill(''))
  }
  instantBuild() {
    // If unvisited nodes
    while (this.visited < this.rows * this.cols) {
      const row = this.stackY.at(-1)
      const col = this.stackX.at(-1)

      const neighbors = []

      // Get legit neighbors
      for (let i = 0; i < 4; i++) {
        const newRow = row + this.deltaY[i]
        const newCol = col + this.deltaX[i]

        if (newRow < 0 || newRow === this.rows) continue
        if (newCol < 0 || newCol === this.cols) continue
        if (this.GRID[newRow][newCol]) continue

        neighbors.push([newRow, newCol])
      }

      // Add a random neighbor to stack
      if (neighbors.length) {
        const [newRow, newCol] = neighbors[Math.floor(Math.random() * neighbors.length)]
        const NS = newRow - row, EW = newCol - col

        // Facing up down
        switch (NS) {
          case -1: // North
            this.GRID[row][col] += 'N'
            this.GRID[newRow][newCol] = 'S'
            break

          case 1: // South
            this.GRID[row][col] += 'S'
            this.GRID[newRow][newCol] = 'N'
            break
        }
        // Facing left right
        switch (EW) {
          case 1: // East
            this.GRID[row][col] += 'E'
            this.GRID[newRow][newCol] = 'W'
            break

          case -1: // West
            this.GRID[row][col] += 'W'
            this.GRID[newRow][newCol] = 'E'
            break
        }

        this.stackX.push(newCol)
        this.stackY.push(newRow)
        this.visited++

        // Backtrack if dead end
      } else {
        this.stackX.pop()
        this.stackY.pop()
      }
    }
    return this.GRID
  }
}