'use strict';

var Backbone = require('backbone');
var Marionette = require('backbone.marionette');

var helpers = require('../helpers');
var AddReview = require('./addReview');
var ListView = require('./list');

var Reviews = Marionette.View.extend({
    template: require('../templates/reviews.html'),

    regions: {
        list: '.review-list',
        modalHook: '#modal-hook'
    },

    ui: {
        $reviews: '#reviews',
        $addBtn: '.add-review-btn'
    },

    events: {
        'click @ui.$addBtn': 'openAddReviewFrm'
    },

    onRender() {
        this.showChildView('list', new ListView({collection: this.collection}));
    },

    getReviewList: function() {
        //TODO: getreviews list from server
        var initialData = [
            {author: 'Ivan', text: 'everything was cool', img: helpers.DummyImg},
            {author: 'Mykola', text: 'not bad', img: helpers.DummyImg}
        ];

        return new Backbone.Collection(initialData);
    },

    onShowReviewList: function() {
        this.collection = this.getReviewList();

        this.render();
    },

    openAddReviewFrm: function () {
        var addReview = new AddReview({model: this.model});
        addReview.on('add:review:item', this.onAddReviewItem, this);

        this.showChildView('modalHook', addReview);
        addReview.needShow();
    },

    onAddReviewItem: function(child) {
        this.model.set({
            author: child.ui.$addAuthor.val(),
            text: child.ui.$addText.val(),
            img: child.ui.$screenshot.length ? child.ui.$screenshot[0].src : ''
        });

        var items = this.model.pick('author', 'text', 'img');
        this.collection.add(items);

        this.itemAdded();
    },

    itemAdded: function() {
        this.model.set({
            author: '',
            text: '',
            img: ''
        });
    }
});

module.exports = Reviews;