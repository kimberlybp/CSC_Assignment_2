//document.getElementById('loading-overlay').style.display = 'block';
// If a fetch error occurs, log it to the console and show it in the UI.
var handleFetchResult = function (result) {
    if (!result.ok) {
        return result
            .json()
            .then(function (json) {
                if (json.error && json.error.message) {
                    throw new Error(result.url + ' ' + result.status + ' ' + json.error.message);
                }
            })
            .catch(function (err) {
                showErrorMessage(err);
                throw err;
            });
    }
    return result.json();
};

// Create a Checkout Session with the selected plan ID
var createCheckoutSession = async function (priceId, customerId) {
    const result = await fetch('/create-checkout-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            priceId: priceId,
        }),
    });
    return handleFetchResult(result);
};

// Handle any errors returned from Checkout
var handleResult = function (result) {
    if (result.error) {
        showErrorMessage(result.error.message);
    }
};

var showErrorMessage = function (message) {
    var errorEl = document.getElementById('error-message');
    errorEl.textContent = message;
    errorEl.style.display = 'block';
};

/* Get your Stripe publishable key to initialize Stripe.js */
fetch('/setup')
    .then(handleFetchResult)
    .then(function () {
        var publishableKey =
            'pk_test_51Hx6udF6nia1fA2P8wOMf1eodbJIt7gYStqUoDYJQjeTB97PPXmNPRjAHNkUyIot3x10XPIvWfNmbRg7ysMuusZV008fphPWNk';
        var subscriptionPriceId = 'price_1ICnFzF6nia1fA2PrjjPHyEA';
        var customerId = 'cus_IfjppW291BfofB'; // Need a dynamic cus id
        // var customerEmail = 'abc.com';

        var stripe = Stripe(publishableKey);

        // Setup event handler to create a Checkout Session when button is clicked
        document.getElementById('subscription-plan-btn').addEventListener('click', function (evt) {
            document.getElementById('loading-overlay').style.display = 'block';
            createCheckoutSession(subscriptionPriceId, customerId).then(function (data) {
                // Call Stripe.js method to redirect to the new Checkout page
                stripe
                    .redirectToCheckout({
                        sessionId: data.sessionId,
                    })
                    .then(handleResult);
            });
        });

        // if (customerEmail) {
        //     document.getElementById('welcome').innerHTML = 'Welcome ' + customerEmail + '!';
        // } else {
        //     document.getElementById('welcome').innerHTML = 'Welcome guest user!';
        //     document.getElementById('logout').innerHTML = 'Back to Login';
        // }

        const manageBillingForm = document.querySelector('#manage-billing-form');
        manageBillingForm.addEventListener('submit', function (e) {
            e.preventDefault();
            document.getElementById('loading-overlay').style.display = 'block';
            fetch('/customer-portal-byId', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerId: 'cus_IfjppW291BfofB', // Need a dynamic cus id
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    window.location.href = data.url;
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        });

        if (customerId == null) {
            document.getElementById('manage').disabled = true;
        }

        document.getElementById('loading-overlay').style.display = 'none';
    });
