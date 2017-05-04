import { Template } from 'meteor/templating';

import './simulateMenu.html';
import { getWay, simulate, stopSimulation } from './simulate.js';


Template.simulateMenu.events({
	'click #simulation_run'(event) {
		// Checks and alerts about perimeter and stations minimum quantity
		if (vertices.length < 3) {
			console.log(vertices.length);
			alert("There are should be more then 3 vertices to form a perimeter");
		} else if (stations.length == 0) {
			alert("There is should be at least one drone station");
		
		// Run a simulation
		} else {
			simulate();
			
			var el = document.getElementById("simulation_run");
			el.innerHTML = 'Stop<i class="material-icons right">stop</i>';
			el.id = "simulation_stop";
		}
	},

	'click #simulation_stop'(event) {
		// code to stop simulation
		stopSimulation();
		
		var el = document.getElementById("simulation_stop");
		el.innerHTML = 'Run<i class="material-icons right">play_arrow</i>';
		el.id = "simulation_run";
	},
});


Template.area.onRendered(function(){
	document.getElementById("simulation_speed").value = settings.speed;
	document.getElementById("simulation_dronespeed").value = settings.droneSpeed;
});