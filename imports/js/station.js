import { Template } from 'meteor/templating';

import './station.html';

Template.station.helpers({
    test() {
        return vertices.length;
    },
});
