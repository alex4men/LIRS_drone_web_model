/**
 * Drone partol library
 */
function DronePatrol() {}

DronePatrol.prototype.Position = function(x, y) { this.x = x; this.y = y; }

// NOTE: not implemented
DronePatrol.prototype.Territory = function(pillars = []) {
    this.pillars = pillars;
}

DronePatrol.prototype.Station = function(id, position, drones = []) {
    this.position = position; // position of station
    this.docks = 3; // number of drone slots
    this.drones_in_dock = drones.length;
    this.drones = drones;
	this.id = id;
}

DronePatrol.prototype.Drone = function(position, speed, capacity) {
    this.capacity = capacity; // current baterry status
    this.position = position; // current position
    this.speed = speed; // speed of drone
    this.target = null; // target object
    this.pursue_mode = false; // wether drone pursuing target or not
}

DronePatrol.prototype.Target = function(position, speed) {
    this.position = position;
    this.prev_position = null; // prev position of target
    this.followed_by = null;
    this.speed = speed;
}

// Move drone to paricular position
DronePatrol.prototype.Drone.prototype.move_to = function(position) {
    let y = position.y - this.position.y;
    let x = position.x - this.position.x;

    if (x == 0) x = 0.00000001

    let alpha = Math.atan(y/x);

    let speed = this.speed;
    if (x < 0 && y >= 0) speed = -speed
    if (x < 0 && y < 0) speed = -speed
    if (x >= 0 && y >= 0) speed = speed
    if (x >= 0 && y < 0) speed = speed

    let y_delta = Math.sin(alpha) * speed;
    let x_delta = Math.cos(alpha) * speed;

    let dp = new DronePatrol();
    this.position = new dp.Position(
        this.position.x + x_delta,
        this.position.y + y_delta
    )

    this.capacity -= 1;
}

// Returns station which is closest to this drone
DronePatrol.prototype.Drone.prototype.get_closest_station = function(stations) {
    let min = 99999999999999999;
    let nearestStation = null;

    for (var i = 0; i < stations.length; i++) {
        let station = stations[i];
        let h = station.position.y - this.position.y;
        let l = station.position.x - this.position.x;
        let distance = Math.sqrt(h*h + l*l);

        if (distance < min && station.drones_in_dock > 0) {
            min = distance;
            nearestStation = station;
        }
    }

    if (nearestStation == null) console.log("Error: there are no stations with drones");
    return nearestStation;
}

// Gets closes free station
DronePatrol.prototype.Drone.prototype.get_closest_station_for_land = function(stations) {
    let min = 99999999999999999;
    let nearestStation = null;
    for (var i = 0; i < stations.length; i++) {
        let station = stations[i];
        let h = station.position.y - this.position.y;
        let l = station.position.x - this.position.x;
        let distance = Math.sqrt(h*h + l*l);

        if (distance < min && station.docks > station.drones.length) {
            min = distance;
            nearestStation = station;
        }
    }

    if (nearestStation == null) console.log("Error: there are no stations to land");
    return nearestStation;
}

// Is drone have enough battery for safe docking
DronePatrol.prototype.Drone.prototype.enough_battery = function(stations) {
    let station = this.get_closest_station_for_land(stations);

    let a = this.position.x - station.position.x;
    let b = this.position.y - station.position.y;
    let distance = Math.sqrt(a*a + b*b);

    return distance / this.speed < this.capacity;
}

// Pursue target
DronePatrol.prototype.Drone.prototype.pursue = function() {
    this.move_to(this.target.position);
}

// Wether drone reached station
DronePatrol.prototype.Drone.prototype.is_station_reached = function() {
    if (Math.abs(this.position.x - this.target.position.x) < this.speed &&
        Math.abs(this.position.y - this.target.position.y) < this.speed
    ) return true;

    return false;
}

// Wether target reached its goal
DronePatrol.prototype.Target.prototype.is_goal_reached = function(goal) {
    if (Math.abs(this.position.x - goal.x) < this.speed &&
        Math.abs(this.position.y - goal.y) < this.speed
    ) return true;

    return false;
}

// Move target to paricular position
DronePatrol.prototype.Target.prototype.move_to = function(position) {
    let y = position.y - this.position.y;
    let x = position.x - this.position.x;

    if (x == 0) x = 0.00000001

    let alpha = Math.atan(y/x);

    let speed = this.speed;
    if (x < 0 && y >= 0) speed = -speed
    if (x < 0 && y < 0) speed = -speed
    if (x >= 0 && y >= 0) speed = speed
    if (x >= 0 && y < 0) speed = speed

    let y_delta = Math.sin(alpha) * speed;
    let x_delta = Math.cos(alpha) * speed;

    this.prev_position = this.position;

    let dp = new DronePatrol();
    this.position = new dp.Position(
        this.position.x + x_delta,
        this.position.y + y_delta
    )
}

// Adds drone to station
DronePatrol.prototype.Station.prototype.add_drone = function(drone) {
    this.drones.push(drone);
    this.drones_in_dock = this.drones_in_dock + 1;
}

// Returns free drone from station
DronePatrol.prototype.Station.prototype.get_drone = function() {
    if (this.drones_in_dock <= 0) console.log("Error: there are no drones to cut off");

    let drone = this.drones.pop();
    this.drones_in_dock = this.drones_in_dock - 1;

    return drone;
}

// Checks wether object in rectangle
DronePatrol.prototype.Territory.prototype.is_inside = function(target) {
    let a = this.pillars[0];
    let b = this.pillars[1];
    let d = this.pillars[3];

    bax = b.x - a.x;
    bay = b.y - a.y;
    dax = d.x - a.x;
    day = d.y - a.y;

    if ((target.position.x - a.x) * bax + (target.position.y - a.y) * bay < 0.0) return false;
    if ((target.position.x - b.x) * bax + (target.position.y - b.y) * bay > 0.0) return false;
    if ((target.position.x - a.x) * dax + (target.position.y - a.y) * day < 0.0) return false;
    if ((target.position.x - d.x) * dax + (target.position.y - d.y) * day > 0.0) return false;

    return true;
}

// Gets closest station to target
DronePatrol.prototype.Target.prototype.get_closest_station = function(stations) {
    let min = 99999999999999999;
    let nearestStation = null;

    for (var i = 0; i < stations.length; i++) {
        let station = stations[i];
        let h = station.position.y - this.position.y;
        let l = station.position.x - this.position.x;
        let distance = Math.sqrt(h*h + l*l);
        if (distance < min && station.drones_in_dock > 0) {
            min = distance;
            nearestStation = station;
        }
    }

    if (nearestStation == null) console.log("Error: there are no stations with drones");
    return nearestStation;
}

module.exports.dp = new DronePatrol();
