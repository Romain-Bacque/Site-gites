const debugReqBody = require("debug")("validate:requestBody");
const debugErr = require("debug")("validate:error");
const ExpressError = require("../utilities/ExpressError");

/**
 * Function to validate the body of a request
 * @param {Joi.ObjectSchema} schema - schema to heed
 */
module.exports.validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      const message = error.details.map((elt) => elt.message).join(", ");

      debugReqBody(req.body);
      debugErr(error);
      res.sendStatus(400);
      throw new ExpressError(400, message);
    } else next();
  };
};
