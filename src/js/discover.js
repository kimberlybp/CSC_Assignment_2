$(document).ready(function () {
    $('.ui.dropdown').dropdown();
    showLoader();
    firebase.auth().onAuthStateChanged(function (user) {
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
                    document.getElementById('profilePic').src = result.ProfilePic;
                    document.getElementById('name').innerHTML = result.FirstName + ' ' + result.LastName;
                    document.getElementById('profile').style.display = 'block';
                    hideLoader();
                });
        } else {
            hideLoader();
        }
    });

    let arrayOfTalents = [];
    loadData();

    function loadData() {
        $.ajax({
            type: 'GET',
            url: 'https://amqlyvytfc.execute-api.us-east-1.amazonaws.com/live/talentdetail',
            success: function (data) {
                if (data) {
                    Object.values(data).forEach((element) => {
                        var list = `<div class="ui segment" onclick='storeTalentId(${element.TalentId})'><span class="ui blue text">${element.FirstName} ${element.LastName}</span>
                                 <p>${element.Description}</p></div>`;
                        arrayOfTalents.push(list);
                    });
                    $('#talentsList').append(arrayOfTalents);
                } else $('#talentsList').append('<h1>No record(s)</h1>');
            },
            error: function (data) {},
        });
    }
});

function showLoader() {
    document.getElementById('loader').classList.add('active');
}

function hideLoader() {
    document.getElementById('loader').classList.remove('active');
}
