const Joi = require('joi');

const createFreeCheckoutSessionSchema = Joi.object({
    customerId: Joi.string()
        .trim()
        .required(),
    priceId: Joi.string()
        .trim()
        .required()
});

const createPaidCheckoutSessionSchema = Joi.object({
    customerId: Joi.string()
        .trim()
        .required(),
    priceId: Joi.string()
        .trim()
        .required()
});

const getCheckoutSessionDataSchema = Joi.object({
    sessionId: Joi.string()
        .trim()
        .required()
});

const createNewCustomerSchema = Joi.object({
    email: Joi.string()
        .email()
        .trim()
        .required(),
    uid: Joi.string()
        .trim()
        .required()
});


module.exports = {
    createFreeCheckoutSessionSchema: createFreeCheckoutSessionSchema,
    getCheckoutSessionDataSchema: getCheckoutSessionDataSchema,
    createNewCustomerSchema: createNewCustomerSchema,
    createPaidCheckoutSessionSchema: createPaidCheckoutSessionSchema
}