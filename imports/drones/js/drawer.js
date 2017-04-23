'use strict';

// main class for drawing vertices, edges, paths
class Drawer {

  constructor(size) {
    this.path = "";
    this.edges = [];
    this.vertices = [];
    this.stations = [];
    this.rect_size = 20;
    this.hullPoints = [];
    this.convexHull = new ConvexHullGrahamScan();
    this.field = d3.select('#area').append('svg').attr('width', size).attr('height', size);

  }

  buildHull() {
    console.log("NICE");
  }

  // addVertex() - add a new vertex to the filed, then auto redraw convex hull
  addVertex() {
    if (mouse) {  // check if mouse over another vertex
      mouse = false;
      return;
    }
    var id = +new Date; // timestamp
    let x = event.pageX - 40 - area.rect_size / 2,
        y = event.pageY - 30 - area.rect_size / 2;

    area.field.append('rect')
    .attr('id','vertex_'+id)
    .attr('width', area.rect_size)
    .attr('height', area.rect_size)
    .attr('x', x)
    .attr('y', y)
    .attr('class', 'vertex')
    .attr('onclick',"area.remVertex('vertex_"+id+"');")
    .attr('onmouseover', "mouseStatus(true);")
    .attr('onmouseout', "mouseStatus(false);");

    area.redraw();
  }

  // remVertex(id) - remove vertex with "id" from field
  remVertex(id) {
    d3.select('#'+id).remove().call(area.redraw);
  }

  // getVertices() - get list of vertices coordinates ( [[x1,y1], [x2,y2]] )
  getVertices() {
    area.vertices = d3.selectAll('.vertex').nodes().map(function (el) {
      return [parseInt(d3.select(el).attr('x')), parseInt(d3.select(el).attr('y'))];
    });

    return area.vertices;

  }

  // getEdges() - get edges with start and end [x,y] coordinates ( {[[x1,y1], [x2,y2]], [[x1,y1], [x2,y2]]} )
  getEdges() {
    this.edges = []

    if(area.hullPoints.length < 3)
      return null

    for (let i = 0, len = area.hullPoints.length; i < len; i++) {
      area.edges.push([
        [parseInt(area.hullPoints[i].x) + area.rect_size / 2, parseInt(area.hullPoints[i].y) + area.rect_size / 2], // start point
        [parseInt(area.hullPoints[(i + 1) % len].x) + area.rect_size / 2, parseInt(area.hullPoints[(i + 1) % len].y) + area.rect_size / 2] // end point
      ]);
    }

    return area.edges;

  }

  // getWay() - generate start and end point for bigfoot's moving
  getWay() {
    d3.select('#start').remove();
    d3.select('#end').remove();

    let start = area.edges[getRandomInt(0, area.edges.length - 1)]
    let end   = area.edges[getRandomInt(0, area.edges.length - 1)]

    let m1 = (start[1][1] - start[0][1]) / (start[1][0] - start[0][0] + 0.000000001)
    let m2 = (end[1][1] - end[0][1]) / (end[1][0] - end[0][0] + 0.000000001)

    let t1 = []
    let t2 = []

    t1[0] = getRandomArbitrary(Math.min(start[0][0], start[1][0]), Math.max(start[0][0], start[1][0])) - area.rect_size / 2
    t1[1] = start[1][1] - m1 * (start[1][0] - t1[0]) - area.rect_size / 2

    t2[0] = getRandomArbitrary(Math.min(end[0][0], end[1][0]), Math.max(end[0][0], end[1][0])) - area.rect_size / 2
    t2[1] = end[1][1] - m2 * (end[1][0] - t2[0]) - area.rect_size / 2

    area.field.append('rect')
    .attr('width', area.rect_size)
    .attr('height', area.rect_size)
    .attr('x', t1[0])
    .attr('y', t1[1])
    .attr("fill", "green")
    .attr("id", "start")

    area.field.append('rect')
    .attr('width', area.rect_size)
    .attr('height', area.rect_size)
    .attr('x', t2[0])
    .attr('y', t2[1])
    .attr("fill", "red")
    .attr("id", "end")

    return([t1, t2]);

  }

  // addStation() - add a new station to the filed by right click
  addStation() {
    if (mouse) {  // check if mouse over another vertex
      mouse = false;
      return;
    }
    var id = +new Date; // timestamp
    let x = event.pageX - 40 - area.rect_size / 2,
        y = event.pageY - 30 - area.rect_size / 2;

    area.field.append('rect')
    .attr('id','station_'+id)
    .attr('width', area.rect_size)
    .attr('height', area.rect_size)
    .attr('x', x)
    .attr('y', y)
    .attr('fill', 'blue')
    .attr('class', 'station')
    .attr('oncontextmenu',"area.remStation('station_"+id+"');")
    .attr('onmouseover', "mouseStatus(true);")
    .attr('onmouseout', "mouseStatus(false);");

    area.redraw();
  }

  // remStation(id) - remove station with "id" from field
  remStation(id) {
    d3.select('#'+id).remove().call(area.redraw);
  }


  // getStations() - get list of stations coordinates ( [[x1,y1], [x2,y2]] )
  getStations() {
    area.stations = d3.selectAll('.station').nodes().map(function (el) {
      return [parseInt(d3.select(el).attr('x')), parseInt(d3.select(el).attr('y'))];
    });

    return area.stations;

  }

  redraw() {
    d3.select("#perimeter").remove();
    area.vertices   = area.getVertices();
    area.convexHull = new ConvexHullGrahamScan();
    area.vertices.map(function (el) {area.convexHull.addPoint(el[0], el[1]); });
    area.hullPoints = area.convexHull.getHull();
    area.edges      = area.getEdges();
    area.path       = ""

    if (area.hullPoints.length < 3)
      return;

    for (let i = 0, len = area.hullPoints.length; i < len; i++) {
      area.path += i==0 ? "M" : " L"
      area.path += " " + (parseInt(area.hullPoints[i].x) + area.rect_size / 2) + " " + (parseInt(area.hullPoints[i].y) + area.rect_size / 2)
    };
    area.path += " L " + (parseInt(area.hullPoints[0].x) + area.rect_size / 2) + " " + (parseInt(area.hullPoints[0].y) + area.rect_size / 2)
    area.field.append("path")
    .attr("id", "perimeter")
    .attr("d", area.path)
    .attr("stroke", "blue")
    .attr("stroke-width", 2)
    .attr("fill", "none");
  }
}
