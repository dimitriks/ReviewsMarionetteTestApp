'use strict';

var Marionette = require('backbone.marionette');

var LoginView = Marionette.View.extend({
    template: require('../templates/login.html'),

    ui: {
        $login: '#login',
        $password: '#password',
        $submit: '.sign-in',
        $authorization: '.authorization',
    },

    events: {
        'click @ui.$submit': 'firebaseAuthorization',
        'click @ui.$authorization': 'googleOAuthAuthorization'
    },

    googleOAuthAuthorization: function () {
        var YOUR_CLIENT_ID = '980704705130-tnb76o9nk0ba6tj2atks1kipldkc8kht.apps.googleusercontent.com';
        var YOUR_REDIRECT_URI = 'http://localhost:9000/';
        var queryString = location.hash.substring(1);

        // Parse query string to see if page request is coming from OAuth 2.0 server.
        var params = {};
        var regex = /([^&=]+)=([^&]*)/g, m;
        while (m = regex.exec(queryString)) {
            params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
            // Try to exchange the param values for an access token.
            exchangeOAuth2Token(params);
        }

        // If there's an access token, try an API request.
        // Otherwise, start OAuth 2.0 flow.
        function trySampleRequest() {
            var params = JSON.parse(localStorage.getItem('oauth2-test-params'));
            if (params && params['access_token']) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET',
                    'https://www.googleapis.com/drive/v3/about?fields=user&' +
                    'access_token=' + params['access_token']);
                xhr.onreadystatechange = function (e) {
                    console.log(xhr.response);

                    if (xhr.response.length) {
                        var data = JSON.parse(xhr.response);
                        if (data.user) {
                            if (!app.logged) {
                                app.logged = true;
                                app.router.navigate('reviews', {trigger: true});
                            }
                        }
                    }
                };
                xhr.send(null);
            } else {
                oauth2SignIn();
            }
        }

        /*
         * Create form to request access token from Google's OAuth 2.0 server.
         */
        function oauth2SignIn() {
            // Google's OAuth 2.0 endpoint for requesting an access token
            var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

            // Create element to open OAuth 2.0 endpoint in new window.
            var form = document.createElement('form');
            form.setAttribute('method', 'GET'); // Send as a GET request.
            form.setAttribute('action', oauth2Endpoint);

            // Parameters to pass to OAuth 2.0 endpoint.
            var params = {'client_id': YOUR_CLIENT_ID,
                'redirect_uri': YOUR_REDIRECT_URI,
                'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly',
                'state': 'try_sample_request',
                'include_granted_scopes': 'true',
                'response_type': 'token'};

            // Add form parameters as hidden input values.
            for (var p in params) {
                var input = document.createElement('input');
                input.setAttribute('type', 'hidden');
                input.setAttribute('name', p);
                input.setAttribute('value', params[p]);
                form.appendChild(input);
            }

            // Add form to page and submit it to open the OAuth 2.0 endpoint.
            document.body.appendChild(form);
            form.submit();
        }

        /* Verify the access token received on the query string. */
        function exchangeOAuth2Token(params) {
            var oauth2Endpoint = 'https://www.googleapis.com/oauth2/v3/tokeninfo';
            if (params['access_token']) {
                var xhr = new XMLHttpRequest();
                xhr.open('POST', oauth2Endpoint + '?access_token=' + params['access_token']);
                xhr.onreadystatechange = function (e) {
                    var response = JSON.parse(xhr.response);
                    // When request is finished, verify that the 'aud' property in the
                    // response matches YOUR_CLIENT_ID.
                    if (xhr.readyState == 4 &&
                        xhr.status == 200 &&
                        response['aud'] &&
                        response['aud'] == YOUR_CLIENT_ID) {
                        // Store granted scopes in local storage to facilitate
                        // incremental authorization.
                        params['scope'] = response['scope'];
                        localStorage.setItem('oauth2-test-params', JSON.stringify(params) );
                        if (params['state'] == 'try_sample_request') {
                            trySampleRequest();
                        }
                    } else if (xhr.readyState == 4) {
                        console.log('There was an error processing the token, another ' +
                            'response was returned, or the token was invalid.')
                    }
                };
                xhr.send(null);
            }
        }

        trySampleRequest();
    },

    firebaseAuthorization: function() {
        var submit = this.ui.$submit.prop('disabled', true);
        var authorization = this.ui.$authorization.prop('disabled', true);

        firebase.auth().signInWithEmailAndPassword(this.ui.$login.val(), this.ui.$password.val())
            .then(function(answer) {
                console.log(answer);

                firebase.auth().currentUser.getIdToken()
                    .then(function(token) {
                        if (!app.logged) {
                            app.token = token;
                            app.logged = true;
                            app.router.navigate('reviews', {trigger: true});
                        }
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