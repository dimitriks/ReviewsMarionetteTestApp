'use strict';

var Marionette = require('backbone.marionette');

var Review = Marionette.View.extend({
    tagName: 'li',
    className: 'list-group-item',
    template: require('../templates/reviewitem.html')
});

var ReviewList = Marionette.CollectionView.extend({
    tagName: 'ul',
    className: 'list-group',
    childView: Review
});

module.exports = ReviewList;