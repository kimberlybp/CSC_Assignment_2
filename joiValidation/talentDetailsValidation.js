const Joi = require('joi');

const talentIdSchema= Joi.object({

    TalentId: Joi.number()
    .integer()
    .min(0)
    .required()
})

const talentDataSchema= Joi.object({

    FirstName: Joi.string()
    .allow(null,'')
    .min(1)
    .max(255)
    .required(),

    LastName: Joi.string()
    .allow(null,'')
    .min(1)
    .max(255)
    .required(),

    Description: Joi.string()
    .allow(null,'')
    .required(),

    Gender: Joi.string()
    .alphanum()
    .length(1)
    .allow(null,'')
    .required(),

    Age: Joi.number()
    .integer()
    .min(0)
    .required(),

    Interest: Joi.string()
    .max(600)
    .allow(null,'')
    .required(),

    ProfilePic: Joi.string()
    .allow(null,'')
    .required()
})

const talentAllSchema= Joi.object({

    TalentId: Joi.number()
    .integer()
    .min(0)
    .required(),

    FirstName: Joi.string()
    .allow(null,'')
    .min(1)
    .max(255)
    .required(),

    LastName: Joi.string()
    .allow(null,'')
    .min(1)
    .max(255)
    .required(),

    Description: Joi.string()
    .allow(null,'')
    .required(),

    Gender: Joi.string()
    .alphanum()
    .length(1)
    .allow(null,'')
    .required(),

    Age: Joi.number()
    .integer()
    .min(0)
    .required(),

    Interest: Joi.string()
    .max(600)
    .allow(null,'')
    .required(),

    ProfilePic: Joi.string()
    .allow(null,'')
    .required()
})

module.exports = {
    talentIdSchema: talentIdSchema,
    talentDataSchema: talentDataSchema,
    talentAllSchema: talentAllSchema
}