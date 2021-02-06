const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get("session_id")
const priceId = urlParams.get("price_id");
let userId = null;

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
                    console.log("success")
                }).catch(function (error) {
                    console.log(error);
                });
            })
        }
    } else {
        //redirect out 
        console.log('no user');
    }
});


