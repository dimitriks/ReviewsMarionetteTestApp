var Marionette = require('backbone.marionette');

var LoginView = Marionette.View.extend({
    template: require('../templates/login.html'),

    ui: {
        $login: '#login',
        $password: '#password',
        $submit: '.submit'
    },

    events: {
        'click @ui.$submit': 'submit'
    },

    submit: function() {
        var submit = this.ui.$submit.prop('disabled', true);

        firebase.auth().signInWithEmailAndPassword(this.ui.$login.val(), this.ui.$password.val())
            .then(function(answer) {
                console.log(answer);

                firebase.auth().currentUser.getIdToken()
                    .then(function(token) {
                        app.token = token;

                        app.router.navigate('reviews', {trigger: true});
                    })
            })
            .catch(function(error) {
                submit.prop('disabled', false);
                alert('wrong login or password');
                console.log(error);
            });

        return false;
    }
});

module.exports = LoginView;