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
var createCheckoutSession = function (priceId, customerId) {
    return fetch('/create-checkout-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            priceId: priceId,
            customerId: customerId,
        }),
    }).then(handleFetchResult);
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
