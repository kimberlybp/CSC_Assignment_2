
let storageObj = {};
$(document)
    .ready(function () {
        $('.ui.dropdown')
            .dropdown()
            ;
        showLoader();
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                document.getElementById('login-signup').style.display = 'none';
                //get user info
                axios.get(
                    `/api/getTalentDetailsByFirebase`,
                    { params: { objectID: user.uid } } // returns all plans in db + stripe publishable key
                ).then(async function (res) {
                    const result = await res.data.result[0];
                    document.getElementById("profilePic").src = result.ProfilePic;
                    document.getElementById("name").innerHTML = result.FirstName + ' ' + result.LastName;
                    document.getElementById('profile').style.display = 'block';
                    hideLoader();
                })
            } else {
                hideLoader();
            }
        });



        loadData();

        function loadData() {
            $.ajax({
                type: "GET",
                url: "https://amqlyvytfc.execute-api.us-east-1.amazonaws.com/live/talentdetail",
                success: function (data) {
                    for (var i = 0; i < data.length; i++) {
                        var btnValue = 'button' + i;

                        var list = "<div class='ui item'><a href='/viewIndividualTalent'><button style='text-align:left;' class='ui fluid button' value='" + btnValue + "' onclick=storeTalentId('" + btnValue + "'); >" + data[i].FirstName + " " + data[i].LastName + "<br><br>" + data[i].Description + "</button></div>"
                        $("#talentsList").append(list);

                        storageObj[btnValue] = data[i].TalentId;

                    }
                    console.log(storageObj);
                },
                error: function (data) {
                }
            });
        }




    })

function showLoader() {
    document.getElementById('loader').classList.add("active");
}

function hideLoader() {
    document.getElementById('loader').classList.remove("active");
}


