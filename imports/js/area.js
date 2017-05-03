import { Template } from 'meteor/templating';

import { dp } from './ai';
import { drawPerimeter } from './render';

import './area.html';


Template.area.events({
	'click #perimeter'(event) {
		event.stopPropagation();
	},

	'click #area'(event) {
		var id = +new Date; // timestamp

		field.append('rect')
		.attr('id','vertex_'+id)
		.attr('class', 'vertex')
		.attr('x', event.offsetX)
		.attr('y', event.offsetY);

		drawPerimeter();
	},

	'click .vertex, contextmenu .station'(event) {
		event.preventDefault();
		event.stopPropagation();
		event.target.remove();
		
		if (event.target.class = 'station') {
			var station = event.target;
			d3.selectAll('.' + station.id + '_droneCounter').remove();
		}

		drawPerimeter();
	},

	'contextmenu #area'(event) {
		event.preventDefault();

		var d = new Date();
		var id = 'station_' + d.getTime();
		
		field.append('rect')
		.attr('id',id)
		.attr('class', 'station')
		.attr('x', event.offsetX)
		.attr('y', event.offsetY);
		
		var station = new dp.Station(id, new dp.Position(event.offsetX, event.offsetY), []);
		stations.push(station);
		
		for (i = 0; i < station.docks; i++) {
			field.append("circle")
			.attr('id', id + '_droneCounter_' + i)
			.attr('class', id + '_droneCounter')
			.attr("cx", station.position.x + 15)
			.attr("cy", station.position.y - 8 + 5*i)
			.attr("r", 2)
			.style("fill", "blue");
		}
	},

});

Template.area.onRendered(function(){
	settings = {
		speed: 1,
		droneSpeed: 3,
	};
	path = "";
	edges = [];
	vertices = [];
	stations = [];
	drones = [];
	field = d3.select('#area').append('svg').attr('width', 800).attr('height', 800);
});
