import { Template } from 'meteor/templating';

import './simulateMenu.html';
import { getWay, simulate } from './simulate.js';


Template.simulateMenu.events({
	'click #run'(event) {
		// TODO
		// add checks and display alerts about perimeter and stations minimum quantity
		simulate();
		console.log(event);
		event.target.innerHTML = 'Stop<i class="material-icons right">stop</i>';
		event.target.id = "stop";
	},

	'click #stop'(event) {
		// code to stop simulation
		event.target.innerHTML = 'Run<i class="material-icons right">play_arrow</i>';
		event.target.id = "run";
		stopSimulation();
	},
});