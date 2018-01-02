'use strict';

var Marionette = require('backbone.marionette');
var Router = require('./router');

var initialData = [];

global.app = new Marionette.Application({
    region: '#app-hook',

    onStart: function(options) {
        this.router = new Router(options);

        Backbone.history.start();

    }
});

app.start({initialData: initialData});