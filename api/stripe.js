function stripeApi(stripe) {
    function setUp(req, res) {
        res.send({
            publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
        });
    }

    async function createFreeCheckoutSession(req, res) {
        const domainURL = process.env.DOMAIN;
        const { customerId, priceId } = req.body;

        try {
            const session = await stripe.checkout.sessions.create({
                customer: customerId,
                mode: 'setup',
                payment_method_types: ['card'],
                success_url: `${domainURL}paymentSetupSuccess?session_id={CHECKOUT_SESSION_ID}&price_id=${priceId}`,
                cancel_url: `${domainURL}setUpPlan?session_id={CHECKOUT_SESSION_ID}`,
            });

            res.send({
                sessionId: session.id,
            });
        } catch (e) {
            res.status(400);
            return res.send({
                error: {
                    message: e.message,
                },
            });

        }
    }

    async function createPaidCheckoutSession(req, res) {
        const domainURL = process.env.DOMAIN;
        const { priceId, customerId } = req.body;

        try {
            const session = await stripe.checkout.sessions.create({
                customer: customerId,
                mode: 'subscription',
                payment_method_types: ['card'],
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                success_url: `${domainURL}paymentSetupSuccess?session_id={CHECKOUT_SESSION_ID}&price_id=${priceId}`,
                cancel_url: `${domainURL}setUpPlan?session_id={CHECKOUT_SESSION_ID}`,
            });

            res.send({
                sessionId: session.id,
            });
        } catch (e) {
            res.status(400);
            return res.send({
                error: {
                    message: e.message,
                },
            });

        }
    }


    async function getCheckoutSessionData(req, res) {
        const { sessionId } = req.query;
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        res.send(session);
    }

    async function createNewCustomer(req, res) {
        try {
            const customer = await stripe.customers.create({
                description: 'Talent',
                email: req.body.email,
                metadata: {
                    uid: req.body.uid
                }
            });

            res.status(200).json({ code: 200, customerId: customer.id });
        } catch (e) {
            res.status(500).json({ code: 500, message: 'Internal Stripe Server error.' })
        }
    }


    return {
        setUp: setUp,
        createFreeCheckoutSession: createFreeCheckoutSession,
        getCheckoutSessionData: getCheckoutSessionData,
        createNewCustomer: createNewCustomer,
        createPaidCheckoutSession: createPaidCheckoutSession
    }

}

module.exports = stripeApi;