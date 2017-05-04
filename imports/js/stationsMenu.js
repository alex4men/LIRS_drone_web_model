import { Template } from 'meteor/templating';

import './stationsMenu.html';
import './station.js';

import { getWay, simulate, stopSimulation } from './simulate.js';
Template.stationsMenu.helpers({
    test() {
    	// return [{text: 'kek'}];
        return d3.selectAll('.vertex').nodes().map(function (el) {
			return {text: parseInt(d3.select(el).attr('id')), x: parseInt(d3.select(el).attr('x')), y: parseInt(d3.select(el).attr('y'))};
		});
    },
});

// test: [
//         { text: 'This is task 1' },
//         { text: 'This is task 2' },
//         { text: 'This is task 3' },
//     ],