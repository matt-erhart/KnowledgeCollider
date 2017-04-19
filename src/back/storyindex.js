import React, { cloneElement } from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';

import Test from '../SelectedList'
import 'bootstrap/dist/css/bootstrap.css'
import MeasureText from '../measureText'

//data
import graph from     '../data/graph.json';
import neighbors from '../data/node_neighborhoods.json'
import authors from   "../data/author_connections.json"
import papers from    "../data/papers.json"

import ReactDOM from 'react-dom'
import * as d3 from 'd3'
import calcBBoxes from '../calcBBoxes'

var simulation = d3.forceSimulation()
  .force("link", d3.forceLink().id(function (d) {
    if (!d.id) debugger
    return d.id;
  }))
  .force("charge", d3.forceManyBody().strength(-200))
  .velocityDecay(.6)
  .force("center", d3.forceCenter(500, 500))
  .force("x", d3.forceX().strength(.8))
  .force("y", d3.forceY().strength(.8))
  .on('end', () => console.log('xEnd', graph.nodes[0].x))


simulation
  .nodes(graph.nodes)
simulation.force("link")
  .links(graph.links)

storiesOf('simplify force graph logic', module)
.add('simplify', () => (
  <svg height='1000' width='1000'>
    { console.log('x', graph.nodes[0].x) }
      {graph.nodes.map((node, i) => {
        return <circle key={node.id} cx={node.x} cy={node.y} r='5' fill='black'/>
      })}
  </svg>
))