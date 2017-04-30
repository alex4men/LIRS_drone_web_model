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

		drawPerimeter();
	},

	'contextmenu #area'(event) {
		event.preventDefault();

		var id = +new Date; // timestamp

		field.append('rect')
		.attr('id','station_'+id)
		.attr('class', 'station')
		.attr('x', event.offsetX)
		.attr('y', event.offsetY);

		stations.push(new dp.Station(new dp.Position(event.offsetX, event.offsetY), []));
	},

});

Template.area.onRendered(function(){
	settings = {
		speed: 6,
		droneSpeed: 10,
	};
	path = "";
	edges = [];
	vertices = [];
	stations = [];
	drones = [];
	field = d3.select('#area').append('svg').attr('width', 800).attr('height', 800);
});
