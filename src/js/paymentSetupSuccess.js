const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get("session_id")
const priceId = urlParams.get("price_id");
let userId = null;

$(document)
    .ready(function () {
        showLoader();
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                userId = user.uid;
                if (sessionId) {
                    axios.get(
                        `/api/getCheckoutSessionData`,
                        { params: { sessionId: sessionId } }
                    ).then(function (res) {
                        console.log(res);
                        var customerId = res.data.customer;

                        //Immediately link current user uid with a free plan first
                        axios.post(
                            `/api/postUserSubscriptionPlan`,
                            {
                                uid: userId,
                                stripeCustomerId: customerId,
                                subscriptionPriceId: priceId
                            }
                        ).then(function (res) {
                            hideLoader();
                        }).catch(function (error) {
                            showErrorMessage('Your payment was successful but We have encountered an error. Please contact us about this issue')
                        });
                    })
                }
            } else {
                //redirect out 
                window.location.href = 'signUp';
            }
        });
    });

var showErrorMessage = function (message) {
    $('body')
        .toast({
            message: message,
            class: 'red',
            showProgress: 'bottom'
        });
};



function showLoader() {
    document.getElementById('loader').classList.add("active");
}

function hideLoader() {
    document.getElementById('loader').classList.remove("active");
}