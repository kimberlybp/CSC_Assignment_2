$(document).ready(function () {
    $('.ui.dropdown').dropdown();
    firebase.auth().onAuthStateChanged(function (user) {
        showLoader();
        if (user) {
            document.getElementById('login-signup').style.display = 'none';
            //get user info
            axios
                .get(
                    `/api/getTalentDetailsByFirebase`,
                    { params: { objectID: user.uid } }, // returns all plans in db + stripe publishable key
                )
                .then(async function (res) {
                    const result = await res.data.result[0];
                    if(result.ProfilePic && result.ProfilePic !=="null"){
                        document.getElementById("profilePic").src = result.ProfilePic;
                    }else{
                        document.getElementById("profilePic").src = '/assets/user.png';
                    }
                    document.getElementById('name').innerHTML = result.FirstName + ' ' + result.LastName;
                    document.getElementById('profile').style.display = 'block';
                    hideLoader();
                });
        } else {
            hideLoader();
        }
    });

    let arrayOfTalents = [];
    let recArrayOfTalents = [];
    loadData();
    loadRecommendedData();

    function loadData() {
        showLoader();
        $.ajax({
            type: 'GET',
            url: 'https://amqlyvytfc.execute-api.us-east-1.amazonaws.com/live/talentdetail',
            success: function (data) {
                if (data) {
                    Object.values(data).forEach((element) => {
                        var list = `<div class="ui basic fluid button" style="background-color:white; margin:10px 0" onclick='storeTalentId(${element.TalentId})'><span class="ui blue text">${element.FirstName} ${element.LastName}</span>
                                 <p>${element.Description && element.Description !== "null" ? element.Description : "No description" }</p></div>`;
                        arrayOfTalents.push(list);
                    });
                    $('#talentsList').append(arrayOfTalents);
                } else $('#talentsList').append('<h1>No record(s)</h1>');
                hideLoader();
            },
            error: function (data) {
                $('body')
                    .toast({
                        message: "Error Loading data please refresh the page.",
                        class: 'red',  //cycle through all colors
                        showProgress: 'bottom'
                    });
            },
        });
    }

    function loadRecommendedData() {
        showLoader();
        $.ajax({
            type: 'GET',
            url: 'https://amqlyvytfc.execute-api.us-east-1.amazonaws.com/live/talentdetail/random',
            success: function (data) {
                console.log(data);
                if (data) {
                    Object.values(data).forEach((element) => {
                        var list = `<div class="ui basic fluid button" style="background-color:white; margin:10px 0" onclick='storeTalentId(${element.TalentId})'>
                        <img style="width: 100px; height:100px; border-radius:50%; margin: auto; display: block;" src="${element.ProfilePic && element.ProfilePic !== "null" ? element.ProfilePic : "/assets/user.png"}"/>        
                        <span class="ui blue text">${element.FirstName} ${element.LastName}</span>
                                 <p>${element.Description && element.Description !== "null" ? element.Description : "No description" }</p></div>`;
                        recArrayOfTalents.push(list);
                    });
                    $('#recList').append(recArrayOfTalents);
                } else $('#recList').append('<h1>No record(s)</h1>');
                hideLoader();
            },
            error: function (data) {
                $('body')
                    .toast({
                        message: "Error Loading data please refresh the page.",
                        class: 'red',  //cycle through all colors
                        showProgress: 'bottom'
                    });
            },
        });
    }
});

function showLoader() {
    document.getElementById('loader').classList.add('active');
}

function hideLoader() {
    document.getElementById('loader').classList.remove('active');
}
