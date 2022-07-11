export class PerlinNoise {
  constructor() {
    this.rows = 128
    this.cols = 128

    this.seedArray = []
    this.noiseArray = []

    for (let row = 0; row < this.rows; row++) {
      this.noiseArray.push([])
      this.seedArray.push([])

      for (let col = 0; col < this.cols; col++) {
        this.seedArray[row][col] = Math.random()
        this.noiseArray[row][col] = 1
      }
    }
  }
  perlinNoise2D(octaves, scaleBias) {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        let noise = 0, scale = 1, scaleAcc = 0

        for (let oct = 0; oct < octaves; oct++) {
          const pitch = this.rows >> oct  // bitwise operator equal to rows / (2 ** oct) 

          const X1 = Math.floor(x / pitch) * pitch
          const Y1 = Math.floor(y / pitch) * pitch

          const X2 = (X1 + pitch) % this.rows
          const Y2 = (Y1 + pitch) % this.rows

          const blendX = (x - X1) / pitch
          const blendY = (y - Y1) / pitch

          // Linearly interpolate along x axis 
          const top = (1 - blendX) * this.seedArray[Y1][X1] + blendX * this.seedArray[Y1][X2]
          const bot = (1 - blendX) * this.seedArray[Y2][X1] + blendX * this.seedArray[Y2][X2]

          // Linearly interpolate along y axis
          noise += (blendY * (bot - top) + top) * scale
          scaleAcc += scale
          scale /= scaleBias
        }

        // Map noise to values of 1 to 7
        this.noiseArray[y][x] = Math.floor((noise / scaleAcc) * 7) + 1
      }
    }
    return this.noiseArray
  }
  // Call this after init to return 2D array of 1s
  noNoise() {
    return this.noiseArray
  }
}
