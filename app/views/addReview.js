'use strict';

var Marionette = require('backbone.marionette');
var html2canvas = require('html2canvas');

var AddReview = Marionette.View.extend({
    template: require('../templates/addReview.html'),

    initialize: function () {
        $(document).keyup(this.formKeyUp.bind(this));
    },

    ui: {
        $addAuthor: '#new-review-author',
        $addText: '#new-review-text',
        $screenshot: '.new-screenshot',
        $close: '.addReviewModalCloseBtn',
        $add: '.addReviewModalAcceptBtn'
    },

    events: {
        'click @ui.$close': 'close',
        'click @ui.$add': 'add'
    },

    //trigger add:review:item to reviews
    add: function() {
        this.triggerMethod('add:review:item', this);
        this.close();
    },

    //close modal
    close: function () {
        $("#addReviewModal").css("display", "none");
        $('#addReviewModal').removeClass('show');
    },

    //open modal
    needShow: function () {
        $("#addReviewModal").css("display", "block");
        $('#addReviewModal').addClass('show');
    },

    //take screenshot by combination ctrl+c
    formKeyUp: function(event) {
        if (event.ctrlKey && event.keyCode === 67) {
            html2canvas(document.body).then(function(canvas) {
                $('.new-screenshot').attr('src', canvas.toDataURL("image/png"));
            });
        }
    },
});

module.exports = AddReview;