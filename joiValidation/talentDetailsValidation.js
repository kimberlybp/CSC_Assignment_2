const Joi = require('joi');

const firebaseUidSchema= Joi.object({
    FirebaseUid: Joi.string()
    .min(1)
    .max(255)
    .required()
})

const postTalentProfilePictureSchema = Joi.object({
    fileName: Joi.string()
    .trim()
    .required(),
    image: Joi.string()
    .trim()
    .required(),
    fileType: Joi.string()
    .trim()
    .required()
})

const postUserSubscriptionPlanSchema = Joi.object({
    uid: Joi.string()
    .trim()
    .required(),
    stripeCustomerId: Joi.string()
    .trim()
    .required(),
    subscriptionPriceId: Joi.string()
    .trim()
    .required()
})

module.exports = {
    postTalentProfilePictureSchema: postTalentProfilePictureSchema,
    postUserSubscriptionPlanSchema: postUserSubscriptionPlanSchema,
    firebaseUidSchema: firebaseUidSchema
}