let clarifaiApiKey = '4d5c076734134510a93a887e932c1576';
let workflowId = null;
let imageData = null;
let isHuman = null;
let profilePicUrl = null;
let currentUser = null

let app = new Clarifai.App({
    apiKey: clarifaiApiKey,
});

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log(user.email);
    } else {
      console.log('no user');
    }
  });

$(document)
    .ready(function () {
        const uploadProfilePicBtn = document.getElementById('upload-profilePic-button');
        var image;

        function validateFile(file) {
            var message = "";
            if (!file) {
                message = "This image you are trying to upload does not seem to exist. <br/> Please try uploading an image again."
                return message;
            }

            const validImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/svg'];
            if (!validImageTypes.includes(file.type)) {
                message = "Unsupported file type! Please try uploading a gif, jpeg, png or svg file."
                return message;
            }

            //empty message if it is all valid
            return message;
        }

        uploadProfilePicBtn.addEventListener('change', function () {
            var fileName = this.files[0].name;
            var fileType = this.files[0].type;
            var errMsg = validateFile(this.files[0]);
            if (errMsg === "") {
                var reader = new FileReader();

                reader.onload = (e) => {
                    hideMessage();
                    document.getElementById("profilePic-loading").style.display = "block";

                    image = e.target.result.replace(/^data:image\/(.*);base64,/, '');
                    app.models
                        .initModel({
                            id: 'human',
                            version: '39b52ad6896e40d7884d8cd3b625b8a9',
                        })
                        .then((generalModel) => {
                            return generalModel.predict(image);
                        })
                        .then(
                            function (response) {

                                let concepts = response['outputs'][0]['data']['concepts'];
                                console.log(concepts[0].value);
                                if (concepts[0].value > 0.5) {
                                    isHuman = true;
                                    //Upload to S3
                                    axios.post(
                                        `/api/postTalentProfilePicture`,
                                        {
                                            fileName: getNewProfilePicName(fileName),
                                            fileType: fileType,
                                            image: image
                                        }
                                    ).then(function (res) {
                                        document.getElementById("profilePic-loading").style.display = "none";
                                        document.getElementById('profilePic-preview').src = e.target.result;
                                        showSuccessMessage("Profile picture is human and successfully uploaded.");
                                    }).catch(function (error) {
                                        showErrorMessage("We are having trouble uploading your profile picture. Please try again.");
                                    });

                                } else {
                                    isHuman = false;
                                    document.getElementById("profilePic-loading").style.display = "none";
                                    document.getElementById('profilePic-preview').src = e.target.result;
                                    showErrorMessage("We have detected that the person in your profile picture is not a human. Please upload a real picture of yourself.");
                                }
                            },
                            function (err) {
                                showErrorMessage("An unexpected error occured while validating your profile picture. Please try again.");
                            },
                        );
                }

                reader.readAsDataURL(this.files[0]);
            } else {
                showErrorMessage(errMsg);
            }
        });

        var showErrorMessage = function (message) {
            var messageEl = document.getElementById("profilePic-results-message");
            messageEl.classList.replace('green', 'red');
            messageEl.textContent = message;
            messageEl.style.display = "block";
        };

        var showSuccessMessage = function (message) {
            var messageEl = document.getElementById("profilePic-results-message");
            messageEl.classList.replace('red', 'green');
            messageEl.textContent = message;
            messageEl.style.display = "block";
        };

        var hideMessage = function () {
            document.getElementById("profilePic-results-message").style.display = "none";
        }

        var getNewProfilePicName = function (originalName) {
            const identifier = Math.random().toString().replace(/0\./, '');
            return `${identifier}-${originalName}`;
        };


        $('.ui.form').submit(function (e) {
            if (isHuman !== null && !isHuman) {
                showErrorMessage("We have detected that the person in your profile picture is not a human. Please upload a real picture of yourself.");
            } else if (isHuman !== null && isHuman) {
                showSuccessMessage("Your profile picture is human.");
            }
        });

        $('.ui.form')
            .form({
                fields: {
                    firstName: {
                        identifier: 'firstName',
                        rules: [
                            {
                                type: 'empty',
                                prompt: 'Please enter your First Name'
                            }
                        ]
                    },
                    lastName: {
                        identifier: 'lastName',
                        rules: [
                            {
                                type: 'empty',
                                prompt: 'Please enter your Last Name'
                            }
                        ]
                    }
                },
                onSuccess: function (event, fields) {
                    event.preventDefault();
                    if (isHuman == null || isHuman) {
                        axios.post(
                            `/api/postTalentWithFirebase`,
                            {
                                FirstName: fields.firstName,
                                LastName: fields.lastName,
                                // FirebaseUid: 
                            }
                        ).then(function (res) {
                            document.getElementById("profilePic-loading").style.display = "none";
                            document.getElementById('profilePic-preview').src = e.target.result;
                            showSuccessMessage("Profile picture is human and successfully uploaded.");
                        }).catch(function (error) {
                            showErrorMessage("We are having trouble uploading your profile picture. Please try again.");
                        });
                    } else {
                        $("html, body").animate({ scrollTop: 0 }, 500);
                    }
                    console.log(fields);
                }
            })
            ;
    })
    ;