import './Grid.css'

import { useEffect, useRef, useState } from 'react'

import { Dijkstra } from '../algorithms/Dijkstra'
import { DFS } from '../algorithms/DFS'
import { BFS } from '../algorithms/BSF'
import { AStar } from '../algorithms/AStar'
import { BestFirst } from '../algorithms/BestFirst'
import { MazeGenerator } from '../algorithms/MazeGenerator'
import { PerlinNoise } from '../algorithms/PerlinNoise'

import { Node } from './Node'

// Constants needed for custom layouts
const N = 'N', E = 'E', S = 'S', W = 'W'
const NE = 'NE', ES = 'ES', SW = 'SW', NW = 'NW', EW = 'EW', NS = 'NS'
const NES = 'NES', NEW = 'NEW', ESW = 'ESW', NSW = 'NSW'
const NESW = 'NESW'

const CIRCLES = [
  [ES, ESW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, ESW, SW],
  [NES, NESW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, NESW, NSW],
  [NS, NS, ES, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, ESW, ESW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, ESW, ESW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, SW, NS, NS],
  [NS, NS, NS, ES, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, NEW, NEW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, NEW, NEW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, SW, NS, NS, NS],
  [NS, NS, NS, NS, ES, ESW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, SW, ES, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, SW, NS, NS, NS, NS],
  [NS, NS, NS, NS, NES, NESW, EW, EW, EW, EW, EW, EW, EW, EW, EW, ESW, ESW, EW, EW, EW, EW, EW, EW, EW, EW, EW, SW, NS, NS, ES, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, SW, NS, NS, NS, NS, NS],
  [NS, NS, NS, NS, NS, NS, ES, EW, EW, EW, EW, EW, EW, EW, EW, NEW, NEW, EW, EW, EW, EW, EW, EW, EW, EW, SW, NS, NS, NS, NS, ES, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, SW, NS, NS, NS, NS, NS, NS],
  [NS, NS, NS, NS, NS, NS, NS, ES, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, ESW, SW, NS, NS, NS, NS, NS, NS, ES, EW, EW, EW, EW, EW, EW, EW, ESW, ESW, EW, EW, EW, EW, EW, EW, EW, SW, NS, NS, NS, NS, NS, NS, NS],
  [NS, NS, NS, NS, NS, NS, NS, NS, ES, EW, EW, EW, EW, EW, EW, ESW, ESW, EW, EW, EW, EW, EW, EW, NESW, NSW, NS, NS, NS, NS, NS, NS, NS, ES, EW, EW, EW, EW, EW, EW, NEW, NEW, EW, EW, EW, EW, EW, EW, SW, NS, NS, NS, NS, NS, NS, NS, NS],
  [NS, NS, NS, NS, NS, NS, NS, NS, NS, ES, EW, EW, EW, EW, EW, NEW, NEW, EW, EW, EW, EW, EW, SW, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, ES, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, SW, NS, NS, NS, NS, NS, NS, NS, NS, NS],
  [NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, ES, ESW, EW, EW, EW, EW, EW, EW, EW, EW, EW, SW, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, ES, EW, EW, EW, EW, EW, EW, EW, EW, EW, ESW, SW, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS],
  [NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NES, NESW, EW, EW, EW, EW, EW, EW, EW, EW, SW, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, ES, EW, EW, EW, EW, EW, EW, EW, EW, NESW, NSW, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS],
  [NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, ES, EW, EW, EW, EW, EW, EW, SW, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, ES, EW, EW, ESW, ESW, EW, EW, SW, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS],
  [NS, NES, NSW, NES, NSW, NS, NS, NS, NS, NES, NSW, NS, NS, ES, ESW, ESW, ESW, ESW, SW, NES, NSW, NS, NS, NS, NES, NSW, NS, NES, NSW, NS, NES, NSW, NS, NS, NS, NES, NSW, ES, ESW, NESW, NESW, ESW, SW, NS, NS, NES, NSW, NS, NS, NS, NS, NES, NSW, NES, NSW, NS],
  [NS, NES, NSW, NES, NSW, NS, NS, NS, NS, NES, NSW, NS, NS, NE, NEW, NESW, NESW, NEW, NW, NES, NSW, NS, NS, NS, NES, NSW, NS, NES, NSW, NS, NES, NSW, NS, NS, NS, NES, NSW, NE, NEW, NEW, NEW, NEW, NW, NS, NS, NES, NSW, NS, NS, NS, NS, NES, NSW, NES, NSW, NS],
  [NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NE, EW, EW, NEW, NEW, EW, EW, NW, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NE, EW, EW, EW, EW, EW, EW, NW, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS],
  [NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NE, EW, EW, EW, EW, EW, EW, EW, EW, NW, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NE, EW, EW, EW, EW, EW, EW, EW, EW, NW, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS],
  [NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NE, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, NW, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NE, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, NW, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS],
  [NS, NS, NS, NS, NS, NS, NS, NS, NS, NE, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, NW, NS, NS, NS, NS, NS, NS, NS, NS, NS, NS, NE, EW, EW, EW, EW, EW, ESW, ESW, EW, EW, EW, EW, EW, NW, NS, NS, NS, NS, NS, NS, NS, NS, NS],
  [NS, NS, NS, NS, NS, NS, NS, NS, NE, EW, EW, EW, EW, EW, EW, ESW, ESW, EW, EW, EW, EW, EW, EW, NW, NS, NS, NS, NS, NS, NS, NS, NS, NE, EW, EW, EW, EW, EW, EW, NEW, NEW, EW, EW, EW, EW, EW, EW, NESW, NSW, NS, NS, NS, NS, NS, NS, NS],
  [NS, NS, NS, NS, NS, NS, NS, NE, EW, EW, EW, EW, EW, EW, EW, NEW, NEW, EW, EW, EW, EW, EW, EW, EW, NW, NS, NS, NS, NS, NS, NS, NE, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, NEW, NW, NS, NS, NS, NS, NS, NS, NS],
  [NS, NS, NS, NS, NS, NS, NE, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, NW, NS, NS, NS, NS, NE, EW, EW, EW, EW, EW, EW, EW, EW, ESW, ESW, EW, EW, EW, EW, EW, EW, EW, EW, NW, NS, NS, NS, NS, NS, NS],
  [NS, NS, NS, NS, NS, NE, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, NW, NS, NS, NE, EW, EW, EW, EW, EW, EW, EW, EW, EW, NEW, NEW, EW, EW, EW, EW, EW, EW, EW, EW, EW, NESW, NSW, NS, NS, NS, NS],
  [NS, NS, NS, NS, NE, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, NW, NE, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, NEW, NW, NS, NS, NS, NS],
  [NS, NS, NS, NE, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, ESW, ESW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, ESW, ESW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, NW, NS, NS, NS],
  [NS, NS, NE, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, NEW, NEW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, NEW, NEW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, NW, NS, NS],
  [NS, NE, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, ESW, ESW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, NW, NS],
  [NE, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, NEW, NEW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, EW, NW]
]

const CITY = [
  [ES, EW, ESW, EW, EW, ESW, EW, EW, ESW, EW, ESW, EW, ESW, EW, ESW, EW, EW, EW, ESW, EW, EW, ESW, ESW, EW, EW, EW, ESW, EW, ESW, EW, EW, EW, ESW, ESW, EW, ESW, ESW, EW, ESW, EW, ESW, EW, EW, EW, ESW, EW, ESW, EW, ESW, EW, ESW, EW, EW, ESW, EW, SW],
  [NS, E, NS, S, W, NS, S, W, NS, E, NS, E, NS, E, NS, S, W, W, NS, S, W, NES, NW, S, W, W, NS, E, NS, S, W, W, NES, NW, E, NE, NSW, E, NS, E, N, S, W, W, NS, E, NS, E, NS, E, NS, S, W, NS, E, NS],
  [NS, N, NS, NE, ES, NEW, SW, N, NS, N, NES, EW, NEW, EW, NSW, NE, ES, EW, NESW, SW, N, NS, S, ES, EW, ESW, NEW, ESW, NEW, SW, N, ES, NSW, S, NW, W, NS, N, NS, N, W, ES, EW, ESW, NEW, EW, NEW, ESW, NEW, EW, NEW, SW, N, NS, N, NS],
  [NS, N, NS, N, NS, E, NS, N, NES, EW, NSW, S, W, W, NS, N, NS, S, NES, NEW, ESW, NW, NE, NS, E, NS, E, NS, E, NE, ESW, NEW, NESW, EW, ESW, EW, NSW, N, NE, EW, EW, NSW, E, NS, S, W, W, NS, S, W, W, NES, EW, NEW, EW, NSW],
  [NES, EW, NEW, EW, NSW, N, NES, EW, NW, E, NES, EW, ESW, ESW, NEW, ESW, NW, NE, NS, E, NS, S, NW, NES, EW, NW, N, NS, N, W, NS, E, NS, E, NS, E, NE, SW, S, W, W, NS, N, NS, NE, ES, EW, NEW, EW, SW, NE, NS, S, W, W, NS],
  [NS, S, W, W, NS, N, NS, S, W, NW, NS, E, NE, NSW, E, NS, S, NW, NS, N, NS, NE, ES, NSW, S, W, NW, NS, N, ES, NEW, ESW, NEW, EW, NESW, SW, E, NE, SW, N, ES, NEW, EW, NSW, N, NS, S, W, W, NS, N, NES, EW, ESW, EW, NSW],
  [NES, EW, EW, EW, NEW, ESW, NEW, EW, SW, N, NS, N, W, NS, N, NES, EW, EW, NSW, N, NS, N, NES, NEW, ESW, EW, EW, NESW, EW, NSW, E, N, S, W, NES, NEW, W, E, NE, ESW, NSW, S, W, NES, EW, NSW, NE, ES, EW, NEW, EW, NSW, E, NS, E, NS],
  [NS, S, W, W, W, NS, S, W, NES, EW, NSW, N, ES, NEW, EW, NSW, S, W, NES, EW, NESW, ESW, NW, E, NS, S, W, NS, E, NS, N, W, S, N, NS, S, W, S, E, NE, NEW, ESW, EW, NSW, E, NS, N, NS, S, W, W, NE, EW, NSW, N, NS],
  [NES, EW, EW, SW, N, NS, NE, ES, NW, S, NES, EW, NSW, S, W, NES, W, N, NS, E, NES, NW, E, NW, NS, NE, ES, NEW, ESW, NEW, ESW, EW, NEW, EW, NSW, NE, ES, NEW, SW, S, W, NS, E, NES, EW, NEW, EW, NSW, NE, ES, EW, S, W, N, N, NS],
  [NS, S, W, NS, N, NS, N, NS, S, NW, NS, E, NE, SW, N, NS, S, NW, NES, EW, NW, S, NW, ES, NW, N, NS, E, NS, E, NS, S, W, W, NS, N, N, E, NES, EW, ESW, NEW, EW, NSW, S, W, W, NS, N, NS, S, ES, SW, S, NW, NS],
  [NES, EW, ESW, NEW, ESW, NEW, EW, NEW, W, N, NS, N, W, NS, N, NES, ESW, EW, NSW, S, W, S, N, NS, S, NW, NES, EW, NW, N, NE, EW, SW, N, NS, N, W, ES, NSW, E, N, S, W, NE, EW, ESW, EW, NESW, EW, NW, NE, NES, NW, EW, EW, NSW],
  [NS, E, NS, E, NS, S, W, W, W, ES, NEW, EW, EW, NSW, N, NES, NSW, E, NE, ESW, EW, NESW, EW, NESW, EW, ESW, NW, S, W, NW, W, W, NS, N, NES, ESW, EW, NEW, NSW, N, W, ES, SW, S, W, NS, E, NS, S, W, NW, NS, S, W, W, NS],
  [NES, EW, NW, N, NES, EW, EW, ESW, EW, NSW, E, W, EW, NES, EW, NEW, NSW, N, W, NS, E, NS, E, NS, E, NS, E, ES, EW, ESW, EW, EW, NESW, EW, NEW, NSW, S, W, NS, N, ES, NEW, NESW, EW, EW, NSW, N, NES, EW, ESW, EW, NESW, EW, SW, N, NS],
  [NS, S, W, NW, NS, S, W, NS, E, NS, N, ES, EW, NSW, S, W, NES, W, N, NS, N, NS, N, NE, EW, NESW, EW, NSW, E, NS, S, W, NS, S, W, NE, EW, EW, NESW, EW, NSW, E, NS, S, W, NS, N, NS, E, NS, E, NS, E, NS, N, NS],
  [NES, EW, ESW, EW, NESW, EW, ESW, NEW, ESW, NSW, N, NS, E, NE, SW, N, NS, E, E, NSW, N, NS, N, W, W, NS, E, NS, N, NE, SW, N, NES, EW, SW, S, W, W, NS, E, NS, N, NE, SW, N, NS, N, NS, N, NS, N, NE, EW, NESW, EW, NSW],
  [NS, E, NS, E, NS, E, NS, E, NES, NW, N, NS, N, W, NS, N, NS, N, W, NS, N, NE, EW, EW, EW, NSW, N, NS, N, W, NS, N, NS, E, NS, NE, ES, EW, NSW, N, NS, N, W, NS, N, NES, ESW, NEW, ESW, NW, N, W, W, NS, E, NS],
  [NS, N, NS, N, NS, N, NS, N, NS, S, NW, NS, N, ES, NW, N, NS, N, ES, NEW, SW, S, W, W, W, NES, EW, NES, SW, N, NES, EW, NW, NE, NS, N, NS, E, NS, N, NES, EW, ESW, NEW, ESW, NEW, NW, E, NS, E, E, EW, ESW, NW, N, NS],
  [NES, EW, NEW, EW, NESW, EW, NW, N, NES, EW, ESW, NEW, ESW, NW, S, NW, NES, EW, NSW, E, NE, EW, EW, ESW, EW, NSW, E, NES, NW, N, NS, S, W, NW, NES, EW, NEW, EW, NW, N, NS, E, NS, E, NS, S, W, NW, NS, N, W, W, NS, S, NW, NS],
  [NS, S, W, W, NS, S, W, NW, NS, E, NS, E, NS, E, ES, EW, NW, E, NS, N, W, W, W, NS, E, NS, N, NS, E, ES, NEW, EW, ESW, EW, NW, S, W, W, W, NW, NES, EW, NESW, EW, NEW, EW, SW, N, NS, N, ES, ESW, NSW, NE, ES, NSW],
  [NS, NE, ES, EW, NESW, EW, ESW, EW, NSW, N, NS, N, NES, EW, NSW, S, W, NW, NES, ESW, ESW, EW, ESW, NSW, N, NES, EW, NESW, ESW, NW, S, W, NS, S, W, ES, EW, ESW, ESW, ESW, NW, E, NS, S, W, W, NES, EW, NESW, EW, NESW, NEW, NEW, EW, NEW, NSW],
  [NS, N, NS, E, NS, E, NS, E, NS, N, NE, EW, NSW, E, NE, ESW, EW, ESW, NEW, NEW, NSW, E, NE, NSW, N, NS, E, NE, NSW, E, ES, EW, NSW, NE, ES, NSW, E, NE, NEW, NSW, S, NW, NES, ESW, EW, ESW, NSW, E, NS, E, NS, S, W, W, W, NS],
  [NES, EW, NESW, EW, NW, N, NES, EW, NSW, N, W, W, NS, N, W, NS, E, NS, S, W, NS, N, W, NES, EW, NW, N, W, NS, N, NS, E, NS, N, NE, NSW, N, W, W, NS, NE, ES, NEW, NSW, E, NES, NW, N, NS, N, NES, EW, ESW, EW, EW, NSW],
  [NS, E, NS, S, W, NW, NS, E, NES, EW, EW, ESW, NW, N, ES, NEW, EW, NESW, EW, ESW, NEW, SW, N, NS, S, W, ES, ESW, NEW, ESW, NEW, ESW, NSW, N, W, NES, EW, SW, N, NES, EW, NSW, E, NS, N, NS, E, ES, NW, N, NS, E, NS, S, W, NS],
  [NS, N, NES, EW, ESW, EW, NSW, N, N, S, W, NS, E, ES, NW, S, W, NS, E, NS, E, NS, N, NES, EW, EW, NEW, NSW, E, NS, E, NES, NEW, EW, EW, NSW, E, NES, EW, NSW, E, NS, N, NS, N, NES, EW, NW, S, NW, NS, N, NES, EW, EW, NSW],
  [NES, EW, NSW, E, NS, E, NS, N, W, S, N, NS, N, NS, E, S, N, NS, N, NS, N, NS, N, NS, S, W, W, NS, N, NS, N, NS, S, W, W, NS, N, NS, E, NS, N, NS, N, NS, N, NS, S, W, ES, EW, NSW, N, NS, S, W, NS],
  [NS, E, NE, EW, NSW, N, NES, EW, EW, NSW, N, NES, EW, NW, N, NS, N, NE, EW, NESW, EW, NEW, ESW, NEW, SW, N, ES, NW, N, NS, N, NE, SW, N, ES, NEW, EW, NEW, ESW, NEW, EW, NEW, ESW, NEW, EW, NEW, SW, N, NS, E, NE, EW, NEW, ESW, EW, NSW],
  [NS, N, W, W, NS, N, NS, E, W, NS, N, NS, S, W, NW, NES, SW, S, W, NS, S, W, NS, E, NES, ESW, NSW, S, NW, NS, N, W, NS, N, NS, S, W, W, NS, S, W, W, NS, S, W, W, NS, N, NS, N, W, W, W, NS, E, NS],
  [NE, EW, EW, EW, NEW, EW, NEW, EW, EW, NEW, EW, NEW, EW, EW, EW, NEW, NEW, EW, EW, NEW, EW, EW, NEW, EW, NEW, NEW, NEW, EW, EW, NEW, EW, EW, NEW, EW, NEW, EW, EW, EW, NEW, EW, EW, EW, NEW, EW, EW, EW, NEW, EW, NEW, EW, EW, EW, EW, NEW, EW, NW]
]

const EMPTY = [
  [ES, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, ESW, SW],
  [NES, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NSW],
  [NES, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NSW],
  [NES, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NSW],
  [NES, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NSW],
  [NES, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NSW],
  [NES, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NSW],
  [NES, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NSW],
  [NES, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NSW],
  [NES, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NSW],
  [NES, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NSW],
  [NES, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NSW],
  [NES, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NSW],
  [NES, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NSW],
  [NES, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NSW],
  [NES, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NSW],
  [NES, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NSW],
  [NES, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NSW],
  [NES, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NSW],
  [NES, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NSW],
  [NES, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NSW],
  [NES, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NSW],
  [NES, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NSW],
  [NES, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NSW],
  [NES, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NSW],
  [NES, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NSW],
  [NES, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NESW, NSW],
  [NE, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NEW, NW],
]

const trafficColors = ['IGNORED',
  'rgba(42, 183, 51, 0.75)',
  'rgba(155, 195, 70, 0.75)',
  'rgba(200, 194, 45, 0.75)',
  'rgba(236, 189, 50, 0.75)',
  'rgba(220, 124, 46, 0.75)',
  'rgba(213, 92, 52, 0.75)',
  'rgba(181, 44, 44, 0.75)'
]

export const Grid = ({
  go,
  algo,
  rows, setRows,
  cols, setCols,
  layout,
  matrix, setMatrix,
  speed,
  
  noise, setNoise,
  scaleBias, octates,
  showTraffic,
  xOffset, yOffset,
  
  topMargin,
  seekingStart, setSeekStart,
  seekingEnd, setSeekEnd,
  pathSet, setPath,
  visitedSet, setVisited,
  setCoords, coords,
}) => {
  const [searchHistory, setHistory] = useState(true)        // Boolean to help clear maze after search phase is drawn
  const perNoise = useRef(new PerlinNoise())                // Perlin noise ref so we don't initialize a new 2D array every render
  
  // Use to help animate the algorithms
  function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  // Set in motion the search algorithms
  useEffect(() => {
    let mounted = true

    // Yield newly searched nodes per iteration
    async function getScope(algorithm) {
      if (mounted && !speed) {
        const asyncGen = algorithm.search()

        for await (const scope of asyncGen) {
          if (mounted) {
            setVisited(new Set(scope))
            await sleep(50)

          } else break
        }

      } else if (mounted && speed) {
        const completeScope = algorithm.searchInstant()
        setVisited(completeScope)
      }
    }

    // Yield path traced from end node to start node
    async function getPath(algorithm) {
      const asyncGen = algorithm.buildPath()

      for await (const path of asyncGen) {
        if (mounted) {
          setPath(new Set(path))
          await sleep(20)

        } else break
      }
      // This clears the rest of the search
      setHistory(false)
    }

    if (go) {
      let algorithm

      switch (algo) {
        case 'Dijkstra':
          algorithm = new Dijkstra(matrix, noise, coords, xOffset, yOffset)
          break
        case 'A Star':
          algorithm = new AStar(matrix, noise, coords, xOffset, yOffset)
          break
        case 'DFS':
          algorithm = new DFS(matrix, coords)
          break
        case 'BFS':
          algorithm = new BFS(matrix, coords)
          break
        case 'Best First Search':
          algorithm = new BestFirst(matrix, coords)
          break
      }
      getScope(algorithm).then(() => getPath(algorithm))
    }

    return () => {
      mounted = false // This will break our loop in async generators
      setVisited(new Set())
      setPath(new Set())
      setHistory(true)
    }
  }, [go])

  // Handle traffic and noise
  useEffect(() => {
    if (showTraffic) {
      setNoise([...perNoise.current.perlinNoise2D(octates, scaleBias)])

    } else {
      perNoise.current = new PerlinNoise()
      setNoise([...perNoise.current.noNoise()])
    }
  }, [showTraffic, octates, scaleBias])

  // Handle layout and resizing
  useEffect(() => {
    const matrixMaker = new MazeGenerator(rows, cols)

    // Clear scope and path every time layout changes
    setPath(new Set())
    setVisited(new Set())

    if (layout === 'Maze') {
      setMatrix(matrixMaker.instantBuild())
      setCoords({
        start: { x: 0, y: 0 },
        end: { x: cols - 1, y: rows - 1 }
      })

    } else if (layout === 'Circles') {
      setRows(28)
      setCols(56)
      setMatrix(CIRCLES)
      setCoords({
        start: { x: 13, y: 13 },
        end: { x: 42, y: 13 }
      })

    } else if (layout === 'City') {
      setRows(28)
      setCols(56)
      setMatrix(CITY)
      setCoords({
        start: { x: 10, y: 8 },
        end: { x: 46, y: 20 }
      })

    } else if (layout === 'Empty') {
      setRows(28)
      setCols(56)
      setMatrix(EMPTY)
      setCoords({
        start: { x: 18, y: 13 },
        end: { x: 37, y: 13 }
      })
    }
  }, [rows, cols, layout])

  return (
    <div className="gridDiv"
      style={{
        margin: `${topMargin ? '10vh auto' : '3vh auto'}`,
        borderTop: `${matrix[0] ? 'none' : '2px solid var(--oxfordBlue)'}`,
        borderLeft: `${(matrix[0] && matrix[0][0]) ? 'none' : '2px solid var(--oxfordBlue)'}`
      }}
    >
      {matrix.map((row, i) => row.map((col, j) =>
        <Node
          go={go} 
          row={i} col={j}
          layout={layout}
          matrix={matrix} 
          
          noise={noise} 
          xOffset={xOffset} 
          yOffset={yOffset}
          showTraffic={showTraffic}

          seekingStart={seekingStart} setSeekStart={setSeekStart}
          seekingEnd={seekingEnd} setSeekEnd={setSeekEnd}
          
          trafficColor={trafficColors[noise[i + yOffset][j + xOffset]]}
          left={j * (80 / cols)}
          top={i * (40 / rows)}
          width={80 / cols}
          height={40 / rows}
          
          pathNode={pathSet.has(i * cols + j)}
          visitedNode={visitedSet.has(i * cols + j)}
          coords={coords} setCoords={setCoords}
          searchHistory={searchHistory}
        />
      ))}
    </div>
  )
}