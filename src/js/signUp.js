$(document)
    .ready(function () {
        showLoader();
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
                                type: 'regExp[/^.*(?=.{8,})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/]',
                                prompt: 'Your password must contain at least 8 characters, including one uppercase and one number.'
                            }
                        ]
                    },
                    confirmPassword: {
                        identifier: 'confirmPassword',
                        rules: [
                            {
                                type: 'empty',
                                prompt: 'Please confirm your password'
                            },
                            {
                                type: 'match[password]',
                                prompt: 'Passwords do not match'
                            }
                        ]
                    }
                },
                onSuccess: function (event, fields) {
                    event.preventDefault();
                    showLoader();
                    hideFirebaseError(); // in case its open
                    firebase.auth().createUserWithEmailAndPassword(fields.email, fields.password)
                        .then((userCredential) => {
                            // Signed in 
                            var user = userCredential.user;
                            window.location.href = 'setUpProfile';
                        })
                        .catch((error) => {
                            var errorMessage = 'An unexpected error occured trying to create your account. Please try again.'
                            if (error.code == 'auth/email-already-in-use') {
                                errorMessage = "This email is already taken. Please choose another."
                            } else if (error.code = 'auth/invalid-email') {
                                errorMessage = "Invalid email format."
                            } else if (error.code = 'auth/weak-password') {
                                errorMessage = "Password not strong enough."
                            }
                            hideLoader();
                            showFirebaseError(errorMessage);
                        });
                },
                onFailure: function (formErrors, fields) {
                    hideFirebaseError();
                    return false;
                }
            });
        hideLoader();
    });

function showFirebaseError(message) {
    document.getElementById('firebase-message').innerHTML = message;
    document.getElementById('firebase-message').style.display = "block";
}

function hideFirebaseError() {
    document.getElementById('firebase-message').style.display = "none";
}

function showLoader() {
    document.getElementById('loader').classList.add("active");
}

function hideLoader() {
    document.getElementById('loader').classList.remove("active");
}