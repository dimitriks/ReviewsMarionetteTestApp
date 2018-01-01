var Marionette = require('backbone.marionette');
var Backbone = require('backbone');

var LoginView = require('./views/login');
var ReviewsView = require('./views/reviews');
var ReviewModel = require('./models/review');

var Controller = Marionette.Object.extend({
    initialize: function() {
        var loginView = new LoginView();

        app.showView(loginView);
    },

    default: function() {
        // var loginView = this.getOption('loginView');
        // loginView.showIndex();
    },

    reviewList: function() {
        var reviewsView = new ReviewsView({
                collection: new Backbone.Collection([]),
                // collection: new Backbone.Collection(initialData),
                model: new ReviewModel()
            });
        app.showView(reviewsView);

        reviewsView.triggerMethod('show:review:list');
    },

    reviewAdd: function() {
        var layout = this.getOption('layout');
        layout.triggerMethod('show:review:Add');
    }
});

var Router = Marionette.AppRouter.extend({
    appRoutes: {
        '': 'default',
        'reviews': 'reviewList',
        'reviewadd': 'reviewAdd'
    },

    initialize: function() {
        this.controller = new Controller({
            initialData: this.getOption('initialData')
        });
    }
});

module.exports = Router;
