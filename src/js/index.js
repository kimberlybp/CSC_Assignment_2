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
                    `https://amqlyvytfc.execute-api.us-east-1.amazonaws.com/live/talentdetail/objectID/${user.uid}`,
                    // { params: { objectID: user.uid } } // returns all plans in db + stripe publishable key
                ).then(async function (res) {
                    const result = await res.data[0];
                    console.log(result)
                    if(result.ProfilePic){
                        document.getElementById("profilePic").src = result.ProfilePic;
                    }
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