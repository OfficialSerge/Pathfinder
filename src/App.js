import './App.css'

import { useState } from 'react'

import { Navbar } from './components/Navbar'
import { Grid } from './components/Grid'

function App() {
  const [go, setGo] = useState(false)                            // Start algorithm, clear board
  const [algo, setAlgo] = useState(null)                         // Select an algorithm
  const [layout, setLayout] = useState(null)                     // Select a grid layout
  const [matrix, setMatrix] = useState([])                       // The underlying 2D array representing the board 
  const [rows, setRows] = useState(10)                           // Number of rows
  const [cols, setCols] = useState(20)                           // Number of cols
  const [speed, setSpeed] = useState(false)                      // Toggle the speed of the animation
  
  const [noise, setNoise] = useState([])                         // Perlin Noise 2D array
  const [scaleBias, setBias] = useState(0.35)                    // Set scale bias for Perlin noise 2D 
  const [octates, setOctates] = useState(4)                      // Set octates for Perlin noise 2D
  const [showTraffic, setTraffic] = useState(false)              // Toggle on and off traffic
  const [xOffset, setXOffset] = useState(0)                      // Use to offset the noise array
  const [yOffset, setYOffset] = useState(0)                      // Use to offect the noise array

  const [topMargin, setTop] = useState(false)                    // CSS styling property for lowering grid
  const [seekingStart, setSeekStart] = useState(null)            // Lets user pick where to start
  const [seekingEnd, setSeekEnd] = useState(null)                // Lets user pick where to end
  const [pathSet, setPath] = useState(new Set())                 // The path from start to end returned by an algorithm
  const [visitedSet, setVisited] = useState(new Set())           // Every valid node our algorithm visits in its search
  const [coords, setCoords] = useState({                         // Object storing the start and end (x,y) coordinates
    start: {
      x: 0,
      y: 0
    },
    end: {
      x: cols - 1,
      y: rows - 1
    }
  })

  return (
    <div className="App">
      <Navbar
        go={go} setGo={setGo}
        algo={algo} setAlgo={setAlgo}
        layout={layout} setLayout={setLayout}
        setMatrix={setMatrix}
        rows={rows} setRows={setRows}
        cols={cols} setCols={setCols}
        speed={speed} setSpeed={setSpeed}
        
        octates={octates} setOctates={setOctates}
        scaleBias={scaleBias} setBias={setBias}
        showTraffic={showTraffic} setTraffic={setTraffic}
        xOffset={xOffset} setXOffset={setXOffset}
        yOffset={yOffset} setYOffset={setYOffset}

        setTop={setTop}
        setSeekStart={setSeekStart}
        setSeekEnd={setSeekEnd}
        setPath={setPath}
        setVisited={setVisited}

      />
      <Grid
        go={go}
        algo={algo}
        rows={rows} setRows={setRows}
        cols={cols} setCols={setCols}
        layout={layout}
        matrix={matrix} setMatrix={setMatrix}
        speed={speed}
        
        noise={noise} setNoise={setNoise}
        scaleBias={scaleBias}
        octates={octates}
        showTraffic={showTraffic}
        xOffset={xOffset}
        yOffset={yOffset}
        
        topMargin={topMargin}
        seekingStart={seekingStart} setSeekStart={setSeekStart}
        seekingEnd={seekingEnd} setSeekEnd={setSeekEnd}
        pathSet={pathSet} setPath={setPath}
        visitedSet={visitedSet} setVisited={setVisited}
        coords={coords} setCoords={setCoords}
      />
    </div>
  )
}

export default App;
