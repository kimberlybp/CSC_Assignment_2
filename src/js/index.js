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
                    { params: { FirebaseUid: user.uid } } // returns all plans in db + stripe publishable key
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
    })

    function showLoader() {
        document.getElementById('loader').classList.add("active");
    }
    
    function hideLoader() {
        document.getElementById('loader').classList.remove("active");
    }