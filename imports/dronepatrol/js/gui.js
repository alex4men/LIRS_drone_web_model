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

    area.stations.push(new dp.Station(new dp.Position(x,y), []));
    area.redraw();
  }

  // remStation(id) - remove station with "id" from field
  remStation(id) {
    d3.select('#'+id).remove().call(area.redraw);
  }

  // getStations() - get list of stations coordinates ( [[x1,y1], [x2,y2]] )
  getStations() {
    area.stations = d3.selectAll('.station').nodes().map(function (el) {
      return {position : {x: parseInt(d3.select(el).attr('x')), y: parseInt(d3.select(el).attr('y'))}};
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

  simulate() {
    var BATTERY_CAPACITY = 55;

    // start positions for bigfoot
    var start = new dp.Position(parseInt(d3.select("#start").attr('x')), parseInt(d3.select("#start").attr('y')));
    var end   = new dp.Position(parseInt(d3.select("#end").attr('x')), parseInt(d3.select("#end").attr('y')));
    console.log(start);

    // target
    var target = new dp.Target(start, 5);
    target.marker = area.field
    .append("circle")
    .attr("id", "bigfoot")
    .attr("cx", start.x + area.rect_size / 2)
    .attr("cy", start.y + area.rect_size / 2)
    .attr("r", 8)
    .style("fill", "purple");


    // drones
    var gdrones = []
    for (let i = 0, len = area.stations.length; i < len; i++) {
      var drones = [];
      for (var j = 0; j < 3; j++) {
        var drone = new dp.Drone(new dp.Position(area.stations[i].position.x, area.stations[i].position.y), settings.droneSpeed, BATTERY_CAPACITY);
        drone.marker = area.field
        .append("circle")
        .attr("cx", area.stations[i].position.x + area.rect_size / 2)
        .attr("cy", area.stations[i].position.y + area.rect_size / 2)
        .attr("r", 10)
        .style("fill", "blue");
        drones.push(drone)
        gdrones.push(drone)
      }
      area.stations[i].drones = drones;
      area.stations[i].drones_in_dock = drones.length;

      // console.log(area.stations[i].drones);
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
      if (coordsAreInside([target.position.x, target.position.y], area.hullPoints)) {
        if (!watcher_drone) {
          watcher_drone = target.get_closest_station(area.stations).get_drone();
          console.log(watcher_drone);
        }

        if (!watcher_drone.enough_battery(area.stations)) {
          var cs = watcher_drone.get_closest_station(area.stations);
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
          var station = watcher_drone.get_closest_station_for_land(area.stations);
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

    // var count = 0;
    // function onFrame(event) {
    //   count++;
    //   if (count % settings.speed === 0) {
    //     // target random walk
    //     if (target.is_goal_reached(end)) {
    //       var x = Math.random() * (hl - 0) + 0;
    //       var y = Math.random() * (wh - 0) + 0;
    //
    //       end = new dp.Position(x, y);
    //     }
    //     target.move_to(end);
    //     target.marker.position.x = target.position.x;
    //     target.marker.position.y = target.position.y;
    //     target.marker.fillColor = territory.is_inside(target) ? 'red':'yellow';
    //
    //     // drone watchers
    //     var watcher_drone = target.followed_by
    //     if (territory.is_inside(target)) {
    //       if (!watcher_drone) {
    //         watcher_drone = target.get_closest_station(stations).get_drone();
    //       }
    //
    //       if (!watcher_drone.enough_battery(stations)) {
    //         var cs = watcher_drone.get_closest_station(stations);
    //         var switch_drone = cs.get_drone();
    //         watcher_drone.target = cs;
    //         cs.add_drone(watcher_drone);
    //
    //         watcher_drone = switch_drone;
    //       } else {
    //         watcher_drone.target = target;
    //       }
    //
    //       target.followed_by = watcher_drone;
    //
    //     } else {
    //       if (watcher_drone) {
    //         var station = watcher_drone.get_closest_station_for_land(stations);
    //         watcher_drone.target = station;
    //         station.add_drone(watcher_drone);
    //         target.followed_by = null;
    //       }
    //     }
    //
    //     for (var i = 0; i < gdrones.length; i++) {
    //       var gd = gdrones[i];
    //
    //       if (gd.target) {
    //         gd.pursue();
    //         gd.speed = settings.droneSpeed;
    //         gd.marker.position.x = gd.position.x;
    //         gd.marker.position.y = gd.position.y;
    //
    //         // hack for checking whether it is a station
    //         if (gd.is_station_reached()  && typeof gd.target.docks != 'undefined') {
    //           gd.capacity = BATTERY_CAPACITY;
    //         }
    //       }
    //     }
    //   }
    // }
  }
}
