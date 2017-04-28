import { Template } from 'meteor/templating';

import { mouse, mouseStatus, getRandomInt, getRandomArbitrary } from './utils';
import { ConvexHullGrahamScan } from './graham';

import { dp } from './ai';
import { drawPerimeter } from './render';

import './area.html';



Template.area.events({
	'click #area'(event) {
		event.preventDefault();

		var id = +new Date; // timestamp

		field.append('rect')
		.attr('id','vertex_'+id)
		.attr('width', rect_size)
		.attr('height', rect_size)
		.attr('x', event.offsetX)
		.attr('y', event.offsetY)
		.attr('class', 'vertex');

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
		.attr('width', rect_size)
		.attr('height', rect_size)
		.attr('x', event.offsetX)
		.attr('y', event.offsetY)
		.attr('class', 'station');

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
	rect_size = 20;
	hullPoints = [];
	convexHull = new ConvexHullGrahamScan();
	field = d3.select('#area').append('svg').attr('width', 800).attr('height', 800);
});
