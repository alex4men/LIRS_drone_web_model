import { Template } from 'meteor/templating';

import './stationsMenu.html';
import './station.js';

import { getWay, simulate, stopSimulation } from './simulate.js';
Template.stationsMenu.helpers({
    test2() {
        return vertices.length;
    },
    test: [
        { text: 'This is task 1' },
        { text: 'This is task 2' },
        { text: 'This is task 3' },
    ],
});

