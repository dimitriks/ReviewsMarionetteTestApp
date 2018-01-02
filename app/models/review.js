'use strict';

var Backbone = require('backbone');

var Review = Backbone.Model.extend({
    defaults: {
        author: '',
        text: '',
        img: ''
    }
});

module.exports = Review;