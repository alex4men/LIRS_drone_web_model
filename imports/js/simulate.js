import { getRandomInt, getRandomArbitrary } from './utils';
import { dp } from './ai';
import { coordsAreInside } from './graham';


export function getWay() {
  d3.selectAll("#bigfoot").remove();
  d3.selectAll("#adrone").remove();
  
  let start = edges[getRandomInt(0, edges.length - 1)];
  let end   = edges[getRandomInt(0, edges.length - 1)];

  let m1 = (start[1][1] - start[0][1]) / (start[1][0] - start[0][0] + 0.000000001);
  let m2 = (end[1][1] - end[0][1]) / (end[1][0] - end[0][0] + 0.000000001);

  let t1 = [];
  let t2 = [];

  t1[0] = getRandomArbitrary(Math.min(start[0][0], start[1][0]), Math.max(start[0][0], start[1][0]));
  t1[1] = start[1][1] - m1 * (start[1][0] - t1[0]);

  t2[0] = getRandomArbitrary(Math.min(end[0][0], end[1][0]), Math.max(end[0][0], end[1][0]));
  t2[1] = end[1][1] - m2 * (end[1][0] - t2[0]);

  return([t1, t2]);
}

// getVertices() - get list of vertices coordinates ( [[x1,y1], [x2,y2]] )
export function getVertices() {
    area.vertices = d3.selectAll('.vertex').nodes().map(function (el) {
      return [parseInt(d3.select(el).attr('x')), parseInt(d3.select(el).attr('y'))];
    });

    return area.vertices;
}


export function simulate() {
  simulation_stop = 0;
  var BATTERY_CAPACITY = 55;

  // start positions for bigfoot
  var way = getWay();
  var start = new dp.Position(way[0][0], way[0][1]);
  var end   = new dp.Position(way[1][0], way[1][1]);
  console.log(start);
  
  // territory
  var verticies = getVertices();
	var pillars = [];
    for (i = 0; i < verticies.length; i++) {
		var p = new dp.Position(verticies[i][0], verticies[i][1]);
		pillars.push(p);
		// workaround for triangles
		if (i == 2 && verticies.length == 3) {
			pillars.push(new dp.Position(verticies[i][0], verticies[i][1]));
		}
	}
	var territory = new dp.Territory(pillars);

  // target
  var target = new dp.Target(start, 5);
  target.marker = field
  .append("circle")
  .attr("id", "bigfoot")
  .attr("cx", start.x)
  .attr("cy", start.y)
  .attr("r", 10)
  .style("fill", "purple");


  // drones
  var gdrones = []
  for (let i = 0, len = stations.length; i < len; i++) {
    var drones = [];
    for (var j = 0; j < 3; j++) {
      var drone = new dp.Drone(new dp.Position(stations[i].position.x, stations[i].position.y), settings.droneSpeed, BATTERY_CAPACITY);
      drone.marker = field
      .append("circle")
	  .attr("id", "adrone")
      .attr("cx", stations[i].position.x)
      .attr("cy", stations[i].position.y)
      .attr("r", 8)
      .style("fill", "blue");
      drones.push(drone)
      gdrones.push(drone)
    }
    stations[i].drones = drones;
    stations[i].drones_in_dock = drones.length;

    // console.log(stations[i].drones);
  }

  target.move_to(end);
  // Start animation.
  d3.timer(step, 150);
  var count = 1000;
  

  function step() {
	if (simulation_stop == 1) {
		return true;
	}
    if (target.is_goal_reached(end)) {
        var x = Math.random() * (800 - 0) + 0;
		var y = Math.random() * (800 - 0) + 0;

		end = new dp.Position(x, y);
    }
    target.move_to(end);
    target.marker.attr("cx", target.position.x)
    target.marker.attr("cy", target.position.y)

    // drone watchers
    var watcher_drone = target.followed_by
    if (territory.is_inside(target)) {
      if (!watcher_drone) {
        watcher_drone = target.get_closest_station(stations).get_drone();
        console.log(watcher_drone);
      }

      if (!watcher_drone.enough_battery(stations)) {
        var cs = watcher_drone.get_closest_station(stations);
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
        var station = watcher_drone.get_closest_station_for_land(stations);
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

export function stopSimulation() {
	simulation_stop = 1;
}

