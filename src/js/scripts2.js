//Using IIFE for Implementing Module Pattern to keep the Local Space for the JS Variables
(function () {
    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;
    var strTalentId = window.localStorage.getItem("TalentId");
    var TalentId = parseInt(strTalentId);
    console.log(strTalentId);  

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
    fetch("https://amqlyvytfc.execute-api.us-east-1.amazonaws.com/live/comment/ByTalentId/" + TalentId)
        .then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error("NETWORK RESPONSE ERROR");
            }
        })
        .then(data => {
            console.log(data);
            displayCommentsData(data);
        })
        .catch((error) => console.error("FETCH ERROR:", error));

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

    function addNewComment(event) {
        event.preventDefault();

        var m = new Date();
        //getting current date
        var dateString =
            m.getUTCFullYear() + "-" +
            ("0" + (m.getUTCMonth()+1)).slice(-2) + "-" +
            ("0" + m.getUTCDate()).slice(-2) + " " +
            ("0" + m.getUTCHours()).slice(-2) + ":" +
            ("0" + m.getUTCMinutes()).slice(-2) + ":" +
            ("0" + m.getUTCSeconds()).slice(-2);
            console.log(dateString);

        //gathering required values to POST comment
        var newComment = {
            FirstName: document.getElementById('new_comment_fname').value,
            LastName: document.getElementById('new_comment_lname').value,
            Comment: document.getElementById('new_comment_text').value,
            TalentId: TalentId,
            CreatedAt: dateString
        };

        //comments API
        fetch('https://amqlyvytfc.execute-api.us-east-1.amazonaws.com/live/comment', 
        {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newComment)
        })
            .then((response) => {
                if (response.ok) {
                    //Pass data to display once response is ok
                    newCommentReceived(newComment)
                    commentForm.reset();
                }
            })
            .catch(function (error) {
                console.log('Request failed', error);
            });
    }  

    //Displaying individual Talent's details
    fetch("https://amqlyvytfc.execute-api.us-east-1.amazonaws.com/live/talentdetail/" + TalentId)
        .then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error("NETWORK RESPONSE ERROR");
            }
        })
        .then(data => {
            appendData(data);
        })
        .catch((error) => console.error("FETCH ERROR:", error));

    function appendData(data) {
        var mainContainer = document.getElementById("talent");
        for (var i = 0; i < data.length; i++) {

            //Display profile pic
            var profPic = document.createElement("img");
            profPic.innerHTML = data[i].ProfilePic;
            // profPic.setAttribute("src", "./assets/test.jpg")
            profPic.setAttribute("height", "250")
            profPic.setAttribute("style", "display: block; max-width:300px; max-height:250px; width: auto; height: auto;")
            mainContainer.appendChild(profPic);

            //Display First and Last name
            var name = document.createElement("p");
            name.innerHTML = 'Name: ' + data[i].FirstName + ' ' + data[i].LastName;
            mainContainer.appendChild(name);

            //Display Gender
            var gender = document.createElement("p");
            gender.innerHTML = 'Gender: ' + data[i].Gender;
            mainContainer.appendChild(gender);

            //Display Age
            var age = document.createElement("p");
            age.innerHTML = 'Age: ' + data[i].Age;
            mainContainer.appendChild(age);

            //Display Interest
            var interests = document.createElement("p");
            interests.innerHTML = 'Interests: ' + data[i].Interest;
            mainContainer.appendChild(interests);

            //Display Description
            var descp = document.createElement("p");
            descp.innerHTML = 'Description: ' + data[i].Description;
            mainContainer.appendChild(descp);
        }
    }
})();

