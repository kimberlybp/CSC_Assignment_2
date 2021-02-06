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
                                type: 'length[8]',
                                prompt: 'A password must be at least 8 characters'
                            }
                        ]
                    }
                },
                onSuccess: function (event, fields) {
                    showLoader();
                    firebase.auth().signInWithEmailAndPassword(fields.email, fields.password)
                        .then((userCredential) => {
                            // Signed in
                            var user = userCredential.user;
                            window.location.href = '/';
                        })
                        .catch((error) => {
                            var errorCode = error.code;
                            var errorMessage = error.message;
                            hideLoader();
                            showErrorMessage('An error occurred. Please try logging in again.')
                        });
                }
            })
            ;
            hideLoader();
    })
function showLoader() {
    document.getElementById('loader').classList.add("active");
}

function hideLoader() {
    document.getElementById('loader').classList.remove("active");
}

var showErrorMessage = function (message) {
    $('body')
        .toast({
            message: message,
            class: 'red',  //cycle through all colors
            showProgress: 'bottom'
        });
};