const Joi = require('joi');

const commentIdSchema= Joi.object({

    CommentId: Joi.number()
    .integer()
    .min(0)
    .required()
})

const talentIdSchema= Joi.object({

    TalentId: Joi.number()
    .integer()
    .min(0)
    .required()
})


const commentDataSchema= Joi.object({


    TalentId: Joi.number()
    .integer()
    .min(0)
    .required(),

    FirstName: Joi.string()
    .min(1)
    .max(255)
    .required(),

    LastName: Joi.string()
    .min(1)
    .max(255)
    .required(),

    CreatedAt: Joi.date()
    .iso()
    .required(),

    
    Comment: Joi.string()
    .min(1)
    .max(1000)
    .required()
})

const commentAllSchema= Joi.object({

    CommentId: Joi.number()
    .integer()
    .min(0)
    .required(),

    TalentId: Joi.number()
    .integer()
    .min(0)
    .required(),

    FirstName: Joi.string()
    .min(1)
    .max(255)
    .required(),

    LastName: Joi.string()
    .min(1)
    .max(255)
    .required(),

    CreatedAt: Joi.date()
    .iso()
    .required(),

    
    Comment: Joi.string()
    .min(1)
    .max(1000)
    .required()
})


module.exports = {
    commentIdSchema: commentIdSchema,
    talentIdSchema: talentIdSchema,
    commentDataSchema: commentDataSchema,
    commentAllSchema: commentAllSchema
}