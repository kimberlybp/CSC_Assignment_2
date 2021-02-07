function showLoader() {
    document.getElementById('loader').classList.add("active");
}

function hideLoader() {
    document.getElementById('loader').classList.remove("active");
}


document.getElementById('logout').addEventListener('click', function (e) {
    firebase.auth().signOut().then(function () {
        window.location.href = 'login';
    }, function (error) {
        $('body')
            .toast({
                message: "Error trying to log out. Please refresh the page.",
                class: 'red',  //cycle through all colors
                showProgress: 'bottom'
            });
    });
})

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        document.getElementById('manageBilling').addEventListener('click', function (e) {
            showLoader();
            axios.get(
                `/api/getTalentDataFromFirestore`,
                { params: { uid: user.uid } }
            ).then(async function (res) {
                axios.get(
                    `/api/getCustomerPortal`,
                    { params: { customerId: res.data.data.stripeCustomerId } }
                ).then(async function (res) {
                    window.location.href = res.data.url;
                }).catch(function (e) {
                    $('body')
                        .toast({
                            message: "Error redirecting to Customer Manage billing portal. Please refresh and try again or contact us about this issue.",
                            class: 'red',  //cycle through all colors
                            showProgress: 'bottom'
                        });
                })
            }).catch(function (e) {
                hideLoader();
                $('body')
                    .toast({
                        message: "Error retrieving data. Please refresh and try again or contact us about this issue.",
                        class: 'red',  //cycle through all colors
                        showProgress: 'bottom'
                    });
            })
        })
    } else {
    }
})

