import './Navbar.css'
import './TrafficPanel.css'
import './Scale.css'

export const Navbar = ({
  go, setGo,
  algo, setAlgo,
  layout, setLayout,
  setMatrix,
  rows, setRows,
  cols, setCols,
  speed, setSpeed,

  octates, setOctates,
  scaleBias, setBias,
  showTraffic, setTraffic,
  xOffset, setXOffset,
  yOffset, setYOffset,

  setTop,
  setSeekStart,
  setSeekEnd,
  setPath,
  setVisited
}) => {

  // Will reset the state of the board to a fresh layout
  function resetBoard() {
    setVisited(new Set())
    setPath(new Set())
    setMatrix([])
    setRows(10)
    setCols(20)
    setAlgo(null)
    setSpeed(null)
    setLayout(null)
    setGo(false)
    setTraffic(false)
    setXOffset(0)
    setYOffset(0)
    setOctates(4)
    setBias(0.35)
  }

  // Will set the number of rows and columns of the board
  function setDimensions(newRow, newCol) {
    if (layout !== 'Maze') {
      return

    } else if (10 <= newRow && newRow <= 28) {
      setMatrix([])
      setRows(newRow)
      setCols(newCol)
    }
  }

  return (
    <nav>
      <p>Path Finding Visualizer</p>
      <div className="start" onClick={() => setSeekStart(true)}>Start</div>
      <div className="end" onClick={() => setSeekEnd(true)}>End</div>

      <div className="scale">
        <p>Scale</p>
        <div className="arrowGroup">
          <button onClick={() => setDimensions(rows + 1, cols + 2)} className="arrowUp">
            <div className="arrowN"></div>
          </button>
          <button onClick={() => setDimensions(rows - 1, cols - 2)} className="arrowDown">
            <div className="arrowS"></div>
          </button>
        </div>
      </div>

      <ul className="dropdown">
        <div className="selector">{algo ? algo : 'Algorithm'}</div>
        <div className="dropdownMenu">
          <li onClick={(e) => setAlgo(e.target.innerText)}>Best First Search</li>
          <li onClick={(e) => setAlgo(e.target.innerText)}>Dijkstra</li>
          <li onClick={(e) => setAlgo(e.target.innerText)}>A Star</li>
          <li onClick={(e) => setAlgo(e.target.innerText)}>BFS</li>
          <li onClick={(e) => setAlgo(e.target.innerText)}>DFS</li>
        </div>
      </ul>

      <ul className="dropdown">
        <div className="selector">{layout ? layout : 'Layout'}</div>
        <div className="dropdownMenu">
          <li onClick={(e) => setLayout(e.target.innerText)}>City</li>
          <li onClick={(e) => setLayout(e.target.innerText)}>Empty</li>
          <li onClick={(e) => setLayout(e.target.innerText)}>Circles</li>
          <li onClick={(e) => setLayout(e.target.innerText)}>Maze</li>
        </div>
      </ul>

      <div className="trafficPanel">
        <div onClick={() => setTraffic(!showTraffic)}
             onMouseEnter={() => { setTop(true) }} onMouseLeave={() => { setTop(false) }} className="selector">Traffic</div>
        <div onMouseEnter={() => { setTop(true) }} onMouseLeave={() => { setTop(false) }} className="controlMenu">
          <div className="sliderMenu">
            <p>Randomness</p>
            <input className='slider' type="range" min="1" max="7" value={octates} onChange={(e) => { setOctates(Number(e.target.value)) }} />
            <p>Contrast</p>
            <input className='slider' type="range" min="0.05" max="0.65" step="0.01" value={0.7 - scaleBias} onChange={(e) => { setBias(0.7 - Number(e.target.value)) }} />
          </div>
          <div className="sliderMenu">
            <p>Left Right</p>
            <input className='slider' type="range" min="0" max="70" value={xOffset} onChange={(e) => { setXOffset(Number(e.target.value)) }} />
            <p>Up Down</p>
            <input className='slider' type="range" min="0" max="70" value={yOffset} onChange={(e) => { setYOffset(Number(e.target.value)) }} />
          </div>
        </div>
      </div>

      <button className="basicButton" onClick={() => setSpeed(!speed)}>{speed ? 'Fast' : 'Slow'}</button>
      <button className="basicButton" onClick={() => resetBoard()}>Reset</button>
      <button className="basicButton" onClick={() => setGo(!go)}>{go ? 'Clear' : 'Go'}</button>
    </nav>
  )
}