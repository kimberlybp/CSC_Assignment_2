
var showErrorMessage = function (message) {
    $('body')
        .toast({
            message: message,
            class: 'red',  //cycle through all colors
            showProgress: 'bottom'
        });
};

// Handle any errors returned from Checkout
var handleResult = function (result) {
    if (result.error) {
        showErrorMessage(result.error.message);
    }
};
$(document)
    .ready(function () {
        showLoader();
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                axios.get(
                    `/api/getAllPlans` // returns all plans in db + stripe publishable key
                ).then(function (res) {
                    console.log(res.data);
                    var publishableKey = res.data.publishableKey;
                    var stripe = Stripe(publishableKey);
                    var freePriceId = res.data.result[0].PriceId;
                    var paidPriceId = res.data.result[1].PriceId;
                    var customerId = '';

                    //Create stripe customer and send to firestore 
                    axios.post(
                        `/api/createNewCustomer`,
                        {
                            email: user.email,
                            uid: user.uid
                        }
                    ).then(function (res) {
                        customerId = res.data.customerId;
                        //Immediately link current user uid with a free plan first
                        axios.post(
                            `/api/postUserSubscriptionPlan`,
                            {
                                uid: user.uid,
                                stripeCustomerId: res.data.customerId,
                                subscriptionPriceId: freePriceId
                            }
                        ).then(function (res) {
                            hideLoader();
                        }).catch(function (error) {
                            hideLoader();
                            showErrorMessage("We have encountered an error please refresh the page.");
                        });

                    }).catch(function (error) {
                        hideLoader();
                        showErrorMessage("We have encountered an error please refresh the page.");
                    });

                    //Listeners for Free plan
                    document.getElementById('free-plan-btn').addEventListener('click', function (evt) {
                        $('#freeplan-confirm-modal')
                            .modal('show');
                    });

                    document.getElementById('confirm-freeplan').addEventListener('click', function (evt) {
                        showLoader();
                        axios.post(
                            `/api/createFreeCheckoutSession`,
                            {
                                priceId: freePriceId,
                                customerId: customerId
                            }
                        ).then(async function (res) {
                            const result = await res.data;
                            stripe
                                .redirectToCheckout({
                                    sessionId: result.sessionId,
                                })
                                .then(handleResult);
                        }).catch(function (e) {
                            hideLoader();
                            showErrorMessage("Stripe server error. Please refresh this page again or contact us about this issue.");
                        })
                    });

                    //Paid plan listeners
                    document.getElementById('paid-plan-btn').addEventListener('click', function (evt) {
                        $('#paidplan-confirm-modal')
                            .modal('show');
                    });

                    document.getElementById('confirm-paidplan').addEventListener('click', function (evt) {
                        showLoader();
                        axios.post(
                            `/api/createPaidCheckoutSession`,
                            {
                                customerId: customerId,
                                priceId: paidPriceId
                            }
                        ).then(async function (res) {
                            const result = await res.data;
                            stripe
                                .redirectToCheckout({
                                    sessionId: result.sessionId,
                                })
                                .then(handleResult);
                        }).catch(function (e) {
                            hideLoader();
                            showErrorMessage("Stripe server error. Please refresh this page again or contact us about this issue.");
                        })
                    });
                }).catch(function (error) {
                    hideLoader();
                    showErrorMessage("We have encountered an error retrieving some data please refresh the page.");
                });

            } else {
                //redirect out 
                window.location.href = 'signUp';
            }
        });
    });

// Handle any errors returned from Checkout
var handleResult = function (result) {
    if (result.error) {
        showErrorMessage(result.error.message);
    }
};

function showLoader() {
    document.getElementById('loader').classList.add("active");
}

function hideLoader() {
    document.getElementById('loader').classList.remove("active");
}