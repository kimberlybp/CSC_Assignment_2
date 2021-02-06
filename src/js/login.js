$(document)
    .ready(function () {
        $('.ui.form')
            .form({
                fields: {
                    email: {
                        identifier: 'email',
                        rules: [
                            {
                                type: 'empty',
                                prompt: 'Please enter your e-mail'
                            },
                            {
                                type: 'email',
                                prompt: 'Please enter a valid e-mail'
                            }
                        ]
                    },
                    password: {
                        identifier: 'password',
                        rules: [
                            {
                                type: 'empty',
                                prompt: 'Please enter your password'
                            },
                            {
                                type: 'length[8]',
                                prompt: 'A password must be at least 8 characters'
                            }
                        ]
                    }
                },
                onSuccess: function (event, fields) {
                    firebase.auth().signInWithEmailAndPassword(fields.email, fields.password)
                        .then((userCredential) => {
                            // Signed in
                            var user = userCredential.user;
                            window.location.href = 'home';
                            // ...
                        })
                        .catch((error) => {
                            var errorCode = error.code;
                            var errorMessage = error.message;
                        });
                }
            })
            ;

        })
