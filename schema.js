const joi = require("joi");

//This joi schema helps to validate request data (like req.body, .params) so if the validation came as Invalid then the connection to the Db not froms.
const listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        price: joi.number().required().min(0),
        location: joi.string().required(),
        country: joi.string().required(),
        image: joi.string().allow("",null)
    }).required()
});

module.exports = listingSchema;