//Using IIFE for Implementing Module Pattern to keep the Local Space for the JS Variables
(function () {
    let currentUser = null;
    let isUserPaid = null;

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            currentUser = user;
        }
    });

    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;
    var TalentId = sessionStorage.getItem('TalentId');

    var serverUrl = '/',
        comments = [],
        pusher = new Pusher('3a44ea21cd9b397e8910', {
            cluster: 'ap1',
            encrypted: true,
        }),
        // Subscribing to the 'flash-comments' Channel
        channel = pusher.subscribe('flash-comments'),
        commentForm = document.getElementById('comment-form'),
        commentsList = document.getElementById('comments-list'),
        commentTemplate = document.getElementById('comment-template');

    //FETCH: getting comments from comments API
    fetch('https://amqlyvytfc.execute-api.us-east-1.amazonaws.com/live/comment/ByTalentId/' + TalentId)
        .then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error('NETWORK RESPONSE ERROR');
            }
        })
        .then((data) => {
            console.log(data);
            displayCommentsData(data);
        })
        .catch((error) => console.error('FETCH ERROR:', error));

    // Binding to Pusher Event on our 'flash-comments' Channel
    channel.bind('new_comment', newCommentReceived);
    channel.bind('previous_cmts', displayCommentsData);

    // Adding to Comment Form Submit Event
    // commentForm.addEventListener('submit', addNewComment);
    commentForm.addEventListener('submit', addNewComment);

    // New Comment Receive Event Handler
    // We will take the Comment Template, replace placeholders & append to commentsList
    function newCommentReceived(data) {
        var newCommentHtml = commentTemplate.innerHTML.replace('{{fname}}', data.FirstName);
        newCommentHtml = newCommentHtml.replace('{{lname}}', data.LastName);
        newCommentHtml = newCommentHtml.replace('{{comment}}', data.Comment);
        var newCommentNode = document.createElement('div');
        newCommentNode.classList.add('comment');
        newCommentNode.innerHTML = newCommentHtml;
        commentsList.appendChild(newCommentNode);
    }

    //Displaying comments from comments API
    function displayCommentsData(data) {
        for (var i = 0; i < data.length; i++) {
            var newCommentHtml = commentTemplate.innerHTML.replace('{{fname}}', data[i].FirstName);
            newCommentHtml = newCommentHtml.replace('{{lname}}', data[i].LastName);
            newCommentHtml = newCommentHtml.replace('{{comment}}', data[i].Comment);
            var newCommentNode = document.createElement('div');
            newCommentNode.classList.add('comment');
            newCommentNode.innerHTML = newCommentHtml;
            commentsList.appendChild(newCommentNode);
        }
    }

    function checkUserPaid() {
        //get all plans
        axios.get(
            `/api/getAllPlans` // returns all plans in db + stripe publishable key
        ).then(function (res) {
            let freePriceId = res.data.result[0].PriceId;
            let paidPriceId = res.data.result[1].PriceId;
            axios.get(
                `/api/getTalentDataFromFirestore`,
                { params: { uid: currentUser.uid } }
            ).then(async function (response) {
                var result = await response.data.data;
                if (result.subscriptionPriceId === paidPriceId) {
                    isUserPaid = true;
                } else {
                    isUserPaid = false;
                }
            })
        }).catch(function (e) {
            isUserPaid = false;
        })
        //get talent data from firestore
    }

    async function addNewComment(event) {
        event.preventDefault();
        if (currentUser) {
            axios.get(
                `/api/getAllPlans` // returns all plans in db + stripe publishable key
            ).then(function (res) {
                let freePriceId = res.data.result[0].PriceId;
                let paidPriceId = res.data.result[1].PriceId;
                axios.get(
                    `/api/getTalentDataFromFirestore`,
                    { params: { uid: currentUser.uid } }
                ).then(async function (response) {
                    var result = await response.data.data;
                    if (result.subscriptionPriceId === paidPriceId) {
                        postComment();
                    } else {
                        $('body')
                            .toast({
                                message: "Only paid users are allowed to comment",
                                class: 'yellow',  //cycle through all colors
                                showProgress: 'bottom'
                            });
                    }
                })
            }).catch(function (e) {
                $('body')
                    .toast({
                        displayTime: 0,
                        message: "We have encountered an error please refresh the page.",
                        class: 'red',  //cycle through all colors
                        showProgress: 'bottom'
                    });
            })
        } else {
            $('body')
                .toast({
                    displayTime: 0,
                    message: "Only registered and paid users are allowed to comment",
                    class: 'yellow',  //cycle through all colors
                    showProgress: 'bottom'
                });
        }
    }

    function postComment() {
        var m = new Date();
        //getting current date
        var dateString =
            m.getUTCFullYear() +
            '-' +
            ('0' + (m.getUTCMonth() + 1)).slice(-2) +
            '-' +
            ('0' + m.getUTCDate()).slice(-2) +
            ' ' +
            ('0' + m.getUTCHours()).slice(-2) +
            ':' +
            ('0' + m.getUTCMinutes()).slice(-2) +
            ':' +
            ('0' + m.getUTCSeconds()).slice(-2);
        console.log(dateString);

        //gathering required values to POST comment
        var newComment = {
            FirstName: document.getElementById('new_comment_fname').value,
            LastName: document.getElementById('new_comment_lname').value,
            Comment: document.getElementById('new_comment_text').value,
            TalentId: TalentId,
            CreatedAt: dateString,
        };

        //comments API
        fetch('https://amqlyvytfc.execute-api.us-east-1.amazonaws.com/live/comment', {
            method: 'post',
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newComment),
        })
            .then((response) => {
                if (response.ok) {
                    //Pass data to display once response is ok
                    newCommentReceived(newComment);
                    commentForm.reset();
                }
            })
            .catch(function (error) {
                console.log('Request failed', error);
            });
    }

    //Displaying individual Talent's details
    fetch('https://amqlyvytfc.execute-api.us-east-1.amazonaws.com/live/talentdetail/' + TalentId)
        .then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error('NETWORK RESPONSE ERROR');
            }
        })
        .then((data) => {
            appendData(data);
        })
        .catch((error) => console.error('FETCH ERROR:', error));

    function appendData(data) {
        var mainContainer = document.getElementById('talent');
        for (var i = 0; i < data.length; i++) {
            //Display profile pic
            var profPic = document.createElement('img');
            if (data[i].ProfilePic && data[i].ProfilePic !== "null") {
                profPic.setAttribute("src", data[i].ProfilePic);
            } else {
                profPic.setAttribute("src", "./assets/user.png");
            }

            // profPic.setAttribute("src", "./assets/test.jpg")
            profPic.setAttribute('height', '250');
            profPic.setAttribute(
                'style',
                'display: block; max-width:150px; max-height:150px; width: 100px; height: auto; border-radius:50%',
            );
            mainContainer.appendChild(profPic);

            //Display First and Last name
            var name = document.createElement('p');
            name.innerHTML = 'Name: ' + data[i].FirstName + ' ' + data[i].LastName;
            mainContainer.appendChild(name);

            if (data[i].Gender && data[i].Gender !== "n") {
                //Display Gender
                var gender = document.createElement('p');
                gender.innerHTML = 'Gender: ' + data[i].Gender;
                mainContainer.appendChild(gender);
            }

            if (data[i].Age && data[i].Age !== "null") {
                //Display Age
                var age = document.createElement('p');
                age.innerHTML = 'Age: ' + data[i].Age;
                mainContainer.appendChild(age);
            }

            if (data[i].Interest && data[i].Interest !== "null") {
                //Display Interest
                var interests = document.createElement('p');
                interests.innerHTML = 'Interests: ' + data[i].Interest;
                mainContainer.appendChild(interests);
            }

            if (data[i].Description && data[i].Description !== "null") {
                //Display Description
                var descp = document.createElement('p');
                descp.innerHTML = 'Description: ' + data[i].Description;
                mainContainer.appendChild(descp);
            }
        }
    }
})();
