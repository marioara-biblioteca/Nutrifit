const Joi = require('joi');
const { number } = require('joi');

module.exports.PlanSchema = Joi.object({
    plan: Joi.object({
        title: Joi.string().required(),
        numberOfDays: Joi.number().required().min(10),
        description:Joi.string().required()
    }).required()
})
