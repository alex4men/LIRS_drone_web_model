'use strict';

// main class for drawing vertices, edges, paths
class Field {

  constructor(size) {
    this.size = size;
    this.path = "";
    this.edges = [];
    this.vertices = [];
    this.stations = [];
    this.rect_size = 20;
    this.hullPoints = [];
    this.convexHull = new ConvexHullGrahamScan();
    this.field = d3.select('#field').append('svg').attr('width', this.size).attr('height', this.size);

  }

  buildHull() {
    console.log("NICE");
  }

  addVertex() {
    if (mouse) {  // check if mouse over another vertex
      mouse = false;
      return;
    }
    var id = +new Date; // timestamp
    let x = event.pageX - 40 - field.rect_size/2,
        y = event.pageY - 30 - field.rect_size/2;

    field.field.append('rect')
    .attr('id','vertex_'+id)
    .attr('width', field.rect_size)
    .attr('height', field.rect_size)
    .attr('x', x)
    .attr('y', y)
    .attr('class', 'vertex')
    .attr('onclick',"field.remVertex('vertex_"+id+"');")
    .attr('onmouseover', "mouseStatus(true);")
    .attr('onmouseout', "mouseStatus(false);");

    field.redraw();

  }

  remVertex(id) {
    d3.select('#'+id).remove().call(field.redraw);
  }

  getVertices() {
    field.vertices = d3.selectAll('.vertex').nodes().map(function (el) {
      return [parseInt(d3.select(el).attr('x')), parseInt(d3.select(el).attr('y'))];
    });

    return field.vertices;
  }

  getEdges() {
    this.edges = []
    if(field.hullPoints.length > 1)
    for (let i = 0, len = field.hullPoints.length; i < len; i++) {
      field.edges.push([
        [parseInt(field.hullPoints[i].x) + field.rect_size/2, parseInt(field.hullPoints[i].y) + field.rect_size/2],
        [parseInt(field.hullPoints[(i + 1) % len].x) + field.rect_size/2, parseInt(field.hullPoints[(i + 1) % len].y) + field.rect_size/2]
      ]);
    }

    return field.edges;
  }

  getWay() {
    d3.select('start').remove();
    d3.select('end').remove();
    let start = field.edges[getRandomInt(0, field.edges.length - 1)]
    let end   = field.edges[getRandomInt(0, field.edges.length - 1)]

    let m1 = (start[1][1] - start[0][1]) / (start[1][0] - start[0][0] + 0.000000001)
    let m2 = (end[1][1] - end[0][1]) / (end[1][0] - end[0][0] + 0.000000001)

    let t1 = []
    let t2 = []

    t1[0] = getRandomArbitrary(Math.min(start[0][0], start[1][0]), Math.max(start[0][0], start[1][0])) - field.rect_size/2
    t1[1] = start[1][1] - m1 * (start[1][0] - t1[0]) - field.rect_size/2

    t2[0] = getRandomArbitrary(Math.min(end[0][0], end[1][0]), Math.max(end[0][0], end[1][0])) - field.rect_size/2
    t2[1] = end[1][1] - m2 * (end[1][0] - t2[0]) - field.rect_size/2
    // console.log("start:" + start + " end: " + end)
    // console.log("M1:" + m1 + " M2: " + m2)
    // console.log("T1: " + t1 + " T2: " + t2);
    field.field.append('rect')
    .attr('width', field.rect_size)
    .attr('height', field.rect_size)
    .attr('x', t1[0])
    .attr('y', t1[1])
    .attr("fill", "red")
    .attr("id", "start")

    field.field.append('rect')
    .attr('width', field.rect_size)
    .attr('height', field.rect_size)
    .attr('x', t2[0])
    .attr('y', t2[1])
    .attr("fill", "green")
    .attr("id", "end")
    return([t1, t2]);
  }

  getStations() {
    field.stations = d3.selectAll('.station').nodes().map(function (el) {
      return [parseInt(d3.select(el).attr('x')), parseInt(d3.select(el).attr('y'))];
    });

    return field.stations;
  }

  addStation() {
    if (mouse) {  // check if mouse over another vertex
      mouse = false;
      return;
    }
    var id = +new Date; // timestamp
    let x = event.pageX - 40 - field.rect_size/2,
        y = event.pageY - 30 - field.rect_size/2;

    field.field.append('rect')
    .attr('id','station_'+id)
    .attr('width', field.rect_size)
    .attr('height', field.rect_size)
    .attr('x', x)
    .attr('y', y)
    .attr('fill', 'blue')
    .attr('class', 'station')
    .attr('oncontextmenu',"field.remStation('station_"+id+"');")
    .attr('onmouseover', "mouseStatus(true);")
    .attr('onmouseout', "mouseStatus(false);");

    field.redraw();
  }

  remStation(id) {
    console.log("kaef")
    d3.select('#'+id).remove().call(field.redraw);
  }

  redraw() {
    d3.select("#perimeter").remove();
    field.vertices   = field.getVertices();
    field.convexHull = new ConvexHullGrahamScan();
    field.vertices.map(function (el) {field.convexHull.addPoint(el[0], el[1]); });
    field.hullPoints = field.convexHull.getHull();
    field.edges      = field.getEdges();
    if(field.hullPoints.length > 1) {
      for (let i = 0, len = field.hullPoints.length; i < len; i++) {
        if(i == 0)
        field.path = "M "
        else
        field.path += " L "
        field.path += "" + (parseInt(field.hullPoints[i].x) + field.rect_size/2) + " " + (parseInt(field.hullPoints[i].y) + field.rect_size/2)
      };
      field.path += " L " + (parseInt(field.hullPoints[0].x) + field.rect_size/2) + " " + (parseInt(field.hullPoints[0].y) + field.rect_size/2)
      field.field.append("path")
      .attr("id", "perimeter")
      .attr("d", field.path)
      .attr("stroke", "blue")
      .attr("stroke-width", 2)
      .attr("fill", "none");
    }
  }
}
