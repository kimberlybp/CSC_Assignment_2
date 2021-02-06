const joiValidation = require('../joiValidation/stripeValidation');

function stripeApi(stripe) {
    async function createFreeCheckoutSession(req, res) {
        const { error, value } = joiValidation.createFreeCheckoutSessionSchema.validate(req.body);
        if (!error) {
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

        } else {
            res.status(400).json({ code: 400, message: error });
        }
    }

    async function createPaidCheckoutSession(req, res) {
        const domainURL = process.env.DOMAIN;
        const { error, value } = joiValidation.createPaidCheckoutSessionSchema.validate(req.body);
        if (!error) {
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
        } else {
            res.status(400).json({ code: 400, message: error });
        }
    }


    async function getCheckoutSessionData(req, res) {
        const { error, value } = joiValidation.getCheckoutSessionDataSchema.validate(req.query);
        if (!error) {
            const { sessionId } = req.query;
            const session = await stripe.checkout.sessions.retrieve(sessionId);
            res.send(session);
        } else {
            res.status(400).json({ code: 400, message: error });
        }
    }

    async function createNewCustomer(req, res) {
        const { error, value } = joiValidation.createNewCustomerSchema.validate(req.body);
        if (!error) {
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
        } else {
            res.status(400).json({ code: 400, message: error });
        }
    }


    return {
        createFreeCheckoutSession: createFreeCheckoutSession,
        getCheckoutSessionData: getCheckoutSessionData,
        createNewCustomer: createNewCustomer,
        createPaidCheckoutSession: createPaidCheckoutSession
    }

}

module.exports = stripeApi;