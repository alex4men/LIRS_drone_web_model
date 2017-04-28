import { ConvexHullGrahamScan } from './graham';
import { mouse, mouseStatus, getRandomInt, getRandomArbitrary } from './utils';
import { dp } from './ai';

'use strict';

// main class for drawing vertices, edges, paths
class GUI {

  constructor(size) {
    this.path = "";
    this.edges = [];
    this.vertices = [];
    this.stations = [];
    this.drones = [];
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
    let x = event.pageX - 40 - this.rect_size / 2,
    y = event.pageY - 30 - this.rect_size / 2;

    this.field.append('rect')
    .attr('id','vertex_'+id)
    .attr('width', this.rect_size)
    .attr('height', this.rect_size)
    .attr('x', x)
    .attr('y', y)
    .attr('class', 'vertex')
    .attr('onclick',"remVertex('vertex_"+id+"');")
    .attr('onmouseover', "mouseStatus(true);")
    .attr('onmouseout', "mouseStatus(false);");
    console.log(this.field);

    this.redraw();
  }

  // remVertex(id) - remove vertex with "id" from field
  remVertex(id) {
    d3.select('#'+id).remove().call(this.redraw);
  }

  // getVertices() - get list of vertices coordinates ( [[x1,y1], [x2,y2]] )
  getVertices() {
    this.vertices = d3.selectAll('.vertex').nodes().map(function (el) {
      return [parseInt(d3.select(el).attr('x')), parseInt(d3.select(el).attr('y'))];
    });

    return this.vertices;

  }

  // getEdges() - get edges with start and end [x,y] coordinates ( {[[x1,y1], [x2,y2]], [[x1,y1], [x2,y2]]} )
  getEdges() {
    this.edges = []

    if(this.hullPoints.length < 3)
    return null

    for (let i = 0, len = this.hullPoints.length; i < len; i++) {
      this.edges.push([
        [parseInt(this.hullPoints[i].x) + this.rect_size / 2, parseInt(this.hullPoints[i].y) + this.rect_size / 2], // start point
        [parseInt(this.hullPoints[(i + 1) % len].x) + this.rect_size / 2, parseInt(this.hullPoints[(i + 1) % len].y) + this.rect_size / 2] // end point
      ]);
    }

    return this.edges;

  }

  // getWay() - generate start and end point for bigfoot's moving
  getWay() {
    d3.select('#start').remove();
    d3.select('#end').remove();

    let start = this.edges[getRandomInt(0, this.edges.length - 1)]
    let end   = this.edges[getRandomInt(0, this.edges.length - 1)]

    let m1 = (start[1][1] - start[0][1]) / (start[1][0] - start[0][0] + 0.000000001)
    let m2 = (end[1][1] - end[0][1]) / (end[1][0] - end[0][0] + 0.000000001)

    let t1 = []
    let t2 = []

    t1[0] = getRandomArbitrary(Math.min(start[0][0], start[1][0]), Math.max(start[0][0], start[1][0])) - this.rect_size / 2
    t1[1] = start[1][1] - m1 * (start[1][0] - t1[0]) - this.rect_size / 2

    t2[0] = getRandomArbitrary(Math.min(end[0][0], end[1][0]), Math.max(end[0][0], end[1][0])) - this.rect_size / 2
    t2[1] = end[1][1] - m2 * (end[1][0] - t2[0]) - this.rect_size / 2

    this.field.append('rect')
    .attr('width', this.rect_size)
    .attr('height', this.rect_size)
    .attr('x', t1[0])
    .attr('y', t1[1])
    .attr("fill", "green")
    .attr("id", "start")

    this.field.append('rect')
    .attr('width', this.rect_size)
    .attr('height', this.rect_size)
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
    let x = event.pageX - 40 - this.rect_size / 2,
    y = event.pageY - 30 - this.rect_size / 2;

    this.field.append('rect')
    .attr('id','station_'+id)
    .attr('width', this.rect_size)
    .attr('height', this.rect_size)
    .attr('x', x)
    .attr('y', y)
    .attr('fill', 'blue')
    .attr('class', 'station')
    .attr('oncontextmenu',"this.remStation('station_"+id+"');")
    .attr('onmouseover', "mouseStatus(true);")
    .attr('onmouseout', "mouseStatus(false);");

    this.stations.push(new dp.Station(new dp.Position(x,y), []));
    this.redraw();
  }

  // remStation(id) - remove station with "id" from field
  remStation(id) {
    d3.select('#'+id).remove().call(this.redraw);
  }

  // getStations() - get list of stations coordinates ( [[x1,y1], [x2,y2]] )
  getStations() {
    this.stations = d3.selectAll('.station').nodes().map(function (el) {
      return {position : {x: parseInt(d3.select(el).attr('x')), y: parseInt(d3.select(el).attr('y'))}};
    });

    return this.stations;

  }

  redraw() {
    d3.select("#perimeter").remove();
    this.vertices   = this.getVertices();
    this.convexHull = new ConvexHullGrahamScan();
    this.vertices.map(function (el) {this.convexHull.addPoint(el[0], el[1]); });
    this.hullPoints = this.convexHull.getHull();
    this.edges      = this.getEdges();
    this.path       = ""

    if (this.hullPoints.length < 3)
    return;

    for (let i = 0, len = this.hullPoints.length; i < len; i++) {
      this.path += i==0 ? "M" : " L"
      this.path += " " + (parseInt(this.hullPoints[i].x) + this.rect_size / 2) + " " + (parseInt(this.hullPoints[i].y) + this.rect_size / 2)
    };
    this.path += " L " + (parseInt(this.hullPoints[0].x) + this.rect_size / 2) + " " + (parseInt(this.hullPoints[0].y) + this.rect_size / 2)
    this.field.append("path")
    .attr("id", "perimeter")
    .attr("d", this.path)
    .attr("stroke", "blue")
    .attr("stroke-width", 2)
    .attr("fill", "none");
    console.log('lol');

  }

  simulate() {
    var BATTERY_CAPACITY = 55;

    // start positions for bigfoot
    var start = new dp.Position(parseInt(d3.select("#start").attr('x')), parseInt(d3.select("#start").attr('y')));
    var end   = new dp.Position(parseInt(d3.select("#end").attr('x')), parseInt(d3.select("#end").attr('y')));
    console.log(start);

    // target
    var target = new dp.Target(start, 5);
    target.marker = this.field
    .append("circle")
    .attr("id", "bigfoot")
    .attr("cx", start.x + this.rect_size / 2)
    .attr("cy", start.y + this.rect_size / 2)
    .attr("r", 8)
    .style("fill", "purple");


    // drones
    var gdrones = []
    for (let i = 0, len = this.stations.length; i < len; i++) {
      var drones = [];
      for (var j = 0; j < 3; j++) {
        var drone = new dp.Drone(new dp.Position(this.stations[i].position.x, this.stations[i].position.y), settings.droneSpeed, BATTERY_CAPACITY);
        drone.marker = this.field
        .append("circle")
        .attr("cx", this.stations[i].position.x + this.rect_size / 2)
        .attr("cy", this.stations[i].position.y + this.rect_size / 2)
        .attr("r", 10)
        .style("fill", "blue");
        drones.push(drone)
        gdrones.push(drone)
      }
      this.stations[i].drones = drones;
      this.stations[i].drones_in_dock = drones.length;

      // console.log(this.stations[i].drones);
    }

    target.move_to(end);
    // Start animation.
    d3.timer(step, 150);
    var count = 1000;
    function step() {
      if (target.is_goal_reached(end)) {
        return;
      }
      target.move_to(end);
      // let c = d3.select("#bigfoot")
      // .transition()
      // .attr('cy', 600)
      // .duration(2000)
      // .ease('linear')
      target.marker.attr("cx", target.position.x)
      target.marker.attr("cy", target.position.y)

      // drone watchers
      var watcher_drone = target.followed_by
      if (coordsAreInside([target.position.x, target.position.y], this.hullPoints)) {
        if (!watcher_drone) {
          watcher_drone = target.get_closest_station(this.stations).get_drone();
          console.log(watcher_drone);
        }

        if (!watcher_drone.enough_battery(this.stations)) {
          var cs = watcher_drone.get_closest_station(this.stations);
          var switch_drone = cs.get_drone();
          watcher_drone.target = cs;
          cs.add_drone(watcher_drone);

          watcher_drone = switch_drone;
        } else {
          watcher_drone.target = target;
        }

        target.followed_by = watcher_drone;

      } else {
        if (watcher_drone) {
          var station = watcher_drone.get_closest_station_for_land(this.stations);
          watcher_drone.target = station;
          station.add_drone(watcher_drone);
          target.followed_by = null;
        }
      }

      for (var i = 0; i < gdrones.length; i++) {
        var gd = gdrones[i];

        if (gd.target) {
          gd.pursue();
          gd.speed = settings.droneSpeed;
          gd.marker.attr("cx", gd.position.x)
          gd.marker.attr("cy", gd.position.y)

          // hack for checking whether it is a station
          if (gd.is_station_reached()  && typeof gd.target.docks != 'undefined') {
            gd.capacity = BATTERY_CAPACITY;
          }
        }
      }
    }
    step();

  }
}

module.exports.area = new GUI(800);
