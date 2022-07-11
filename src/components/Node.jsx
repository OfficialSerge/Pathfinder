import './Node.css'

import { useState } from 'react'
import { useEffect } from 'react'

export const Node = ({
  go,
  matrix, 
  row, col,
  
  left, top, width, height,
  
  noise,
  trafficColor, showTraffic,
  xOffset, yOffset,
  
  seekingStart, setSeekStart,
  seekingEnd, setSeekEnd,
  visitedNode, 
  pathNode,
  coords, setCoords,
  searchHistory,
}) => {
  const [borderTop, setTop] = useState('none')                            // Set the top CSS border of grid node
  const [borderLeft, setLeft] = useState('none')                          // Set the left CSS border of grid node
  const [color, setColor] = useState('rgba(0,0,0,0)')                     // Background color of grid node
  const [scopeDot, setScopeDot] = useState(false)                         // Use to illustrate algorithm scope

  // Use to set the start and end coordinates
  function setTarget() {
    if (seekingStart) {
      setCoords({
        start: {
          x: col,
          y: row
        },
        end: {
          x: coords.end.x,
          y: coords.end.y
        }
      })

    } else if (seekingEnd) {
      setCoords({
        start: {
          x: coords.start.x,
          y: coords.start.y
        },
        end: {
          x: col,
          y: row
        }
      })
    }
    setSeekEnd(false)
    setSeekStart(false)
  }

  // Help to visualize path and search scope
  useEffect(() => {
    if (go && searchHistory) {
      visitedNode && setScopeDot(true)

    } else setScopeDot(false)
  }, [searchHistory, visitedNode, go])

  // Help to recolor the node with traffic and target colors
  useEffect(() => {
    if (coords.start.x === col && coords.start.y === row) {
      setColor('var(--teal)')

    } else if (coords.end.x === col && coords.end.y === row) {
      setColor('var(--red)')

    } else if (showTraffic) {
      setColor(trafficColor)

    } else {
      setColor('rgba(0,0,0,0)')
    }
  }, [showTraffic, noise, xOffset, yOffset, coords])

  // Help to adjust borders if matrix changes
  useEffect(() => {
    matrix[row][col].includes('N') ? setTop('none') : setTop('2px solid var(--oxfordBlue)')
    matrix[row][col].includes('W') ? setLeft('none') : setLeft('2px solid var(--oxfordBlue)')

  }, [matrix])

  return (
    matrix[row][col] && <div
      className="Node"
      style={{
        left: `${left}vw`,
        top: `${top}vw`,
        width: `${width}vw`,
        height: `${height}vw`,
        'borderTop': borderTop,
        'marginTop': borderTop === 'none' && '2px',
        'borderLeft': borderLeft,
        'marginLeft': borderLeft === 'none' && '2px',
        'backgroundColor': color,
      }}
      onClick={() => setTarget()}
    >
      {pathNode ? <div className="pathDot"></div> : (scopeDot && <div className="scopeDot"></div>)}
    </div>
  )
} 