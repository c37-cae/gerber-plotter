'use strict'

var expect = require('chai').expect

var PathGraph = require('../lib/path-graph')

describe('path graphs', function() {
  var p
  beforeEach(function() {
    p = new PathGraph()
  })

  it('should be able to traverse', function() {
    expect(p.traverse()).to.eql([])
  })

  it('should be able to add to and traverse a path graph', function() {
    p.add({type: 'line', start: [0, 0], end: [1, 1]})

    expect(p.traverse()).to.eql([
      {type: 'line', start: [0, 0], end: [1, 1]}
    ])
  })

  it('should reverse line segments during traversal', function() {
    p.add({type: 'line', start: [0, 0], end: [1, 1]})
    p.add({type: 'line', start: [1, 0], end: [1, 1]})

    expect(p.traverse()).to.eql([
      {type: 'line', start: [0, 0], end: [1, 1]},
      {type: 'line', start: [1, 1], end: [1, 0]}
    ])
  })

  it('should traverse multiple trees', function() {
    p.add({type: 'line', start: [0, 0], end: [1, 1]})
    p.add({type: 'line', start: [1, 1], end: [1, 2]})
    p.add({type: 'line', start: [2, 2], end: [3, 3]})
    p.add({type: 'line', start: [3, 3], end: [3, 4]})

    expect(p.traverse()).to.eql([
      {type: 'line', start: [0, 0], end: [1, 1]},
      {type: 'line', start: [1, 1], end: [1, 2]},
      {type: 'line', start: [2, 2], end: [3, 3]},
      {type: 'line', start: [3, 3], end: [3, 4]}
    ])
  })

  it('should traverse the graph depth first', function() {
    p.add({type: 'line', start: [0, 0], end: [1, 0]})
    p.add({type: 'line', start: [0, 0], end: [-1, 0]})
    p.add({type: 'line', start: [0, 1], end: [1, 1]})
    p.add({type: 'line', start: [-1, -1], end: [0, -1]})
    p.add({type: 'line', start: [0, 0], end: [0, 1]})
    p.add({type: 'line', start: [0, 0], end: [0, -1]})
    p.add({type: 'line', start: [1, 0], end: [1, 1]})
    p.add({type: 'line', start: [-1, 0], end: [-1, -1]})

    expect(p.traverse()).to.eql([
      {type: 'line', start: [0, 0], end: [1, 0]},
      {type: 'line', start: [1, 0], end: [1, 1]},
      {type: 'line', start: [1, 1], end: [0, 1]},
      {type: 'line', start: [0, 1], end: [0, 0]},
      {type: 'line', start: [0, 0], end: [0, -1]},
      {type: 'line', start: [0, -1], end: [-1, -1]},
      {type: 'line', start: [-1, -1], end: [-1, 0]},
      {type: 'line', start: [-1, 0], end: [0, 0]}
    ])
  })

  it('should reverse arc segments during traversal', function() {
    p.add({type: 'line', start: [0, 0], end: [1, 0]})
    p.add({type: 'arc', start: [2, 1], end: [1, 0], center: [1, 1], radius: 1, dir: 'cw'})
    p.add({type: 'arc', start: [2, 1], end: [3, 2], center: [3, 1], radius: 1, dir: 'cw'})

    expect(p.traverse()).to.eql([
      {type: 'line', start: [0, 0], end: [1, 0]},
      {type: 'arc', start: [1, 0], end: [2, 1], center: [1, 1], radius: 1, dir: 'ccw'},
      {type: 'arc', start: [2, 1], end: [3, 2], center: [3, 1], radius: 1, dir: 'cw'}
    ])
  })
})