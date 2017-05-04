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
	this.targeted = 0;
}

Dronepatrol.prototype.Drone = function(position, speed, timeSpeed, capacity) {
    this.capacity = capacity; // current baterry status
    this.position = position; // current position
    this.speed = speed; // speed of drone
    this.timeSpeed = timeSpeed; // speed of time
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
    let timeSpeed = this.timeSpeed;

    if (x < 0 && y >= 0) speed = -speed * timeSpeed
    if (x < 0 && y < 0) speed = -speed * timeSpeed
    if (x >= 0 && y >= 0) speed = speed * timeSpeed
    if (x >= 0 && y < 0) speed = speed * timeSpeed

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

        if (distance < min && station.docks > (station.drones_in_dock + station.targeted)) {
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
    if (Math.abs(this.position.x - this.target.position.x) < this.speed * this.timeSpeed &&
        Math.abs(this.position.y - this.target.position.y) < this.speed * this.timeSpeed
    ) return true;

    return false;
}

// Wether target reached its goal
DronePatrol.prototype.Target.prototype.is_goal_reached = function(goal) {
    if (Math.abs(this.position.x - goal.x) < this.speed * this.timeSpeed &&
        Math.abs(this.position.y - goal.y) < this.speed * this.timeSpeed
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
    if (x < 0  && y >= 0) speed = -speed * this.timeSpeed 
    if (x < 0  && y < 0 ) speed = -speed * this.timeSpeed
    if (x >= 0 && y >= 0) speed = speed  * this.timeSpeed
    if (x >= 0 && y < 0 ) speed = speed  * this.timeSpeed

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

    function cn_PnPoly( pos, pillars_origin)
    {
        var n = pillars_origin.length;
        var pillars = pillars_origin.slice();
        pillars[pillars.length] = pillars[0];
        var cn = 0;    // the  crossing number counter
        // loop through all edges of the polygon
        var i;
        for (i = 0; i < n; i++) {    // edge from V[i]  to V[i+1]
            if (((pillars[i].y <= pos.y) && (pillars[i+1].y > pos.y))     // an upward crossing
                || ((pillars[i].y > pos.y) && (pillars[i+1].y <=  pos.y))) { // a downward crossing
                // compute  the actual edge-ray intersect x-coordinate
                vt = 0.0;
                vt = (pos.y  - pillars[i].y) / (pillars[i+1].y - pillars[i].y);
                if (pos.x <  pillars[i].x + vt * (pillars[i+1].x - pillars[i].x)) // P.x < intersect
                    ++cn;   // a valid crossing of y=P.y right of P.x
            }
        }
        //return false;
        return ((cn % 2) == 1);    // 0 if even (out), and 1 if  odd (in)
    }

    return cn_PnPoly(target.position, this.pillars);
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
