const baseJoi = require("joi");
const { joiPasswordExtendCore } = require("joi-password");
const joiPassword = baseJoi.extend(joiPasswordExtendCore);
const joiPhoneNumber = baseJoi.extend(require("joi-phone-number"));
const sanitizeHtml = require("sanitize-html");

// Sanitizing
const extension = (joi) => ({
  type: "string",
  base: joi.string(), // extension is defined on joi.string()
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        // Joi will automatically call this method for whatever value it will receive
        const clean = sanitizeHtml(value, {
          allowedTags: [
            "b",
            "i",
            "u",
            "strong",
            "em",
            "p",
            "br",
            "ul",
            "ol",
            "li",
            "a",
          ],
          allowedSchemes: ["http", "https", "mailto"],
          allowedAttributes: {
            a: ["href", "name", "target"],
          },
        });
        if (clean !== value) return helpers.error("string.escapeHTML");
        return clean;
      },
    },
  },
});

const joi = baseJoi.extend(extension);

// Schemas

/**
 * registerSchema monitor the register request body, and return an error if any of requirements doesn't match with it
 */
module.exports.registerSchema = joi
  .object({
    username: joi.string().escapeHTML().required(),
    email: joi
      .string()
      .escapeHTML()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "fr", "net"] } })
      .required(),
    password: joiPassword
      .string()
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .minOfSpecialCharacters(1)
      .noWhiteSpaces()
      .min(8)
      .required(),
  })
  .required();

/**
 * loginSchema monitor the login request body, and return an error if any of requirements doesn't match with it
 */
module.exports.loginSchema = joi
  .object({
    username: joi.string().escapeHTML().required(),
    password: joiPassword
      .string()
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .minOfSpecialCharacters(1)
      .noWhiteSpaces()
      .min(8)
      .required(),
  })
  .required();

/**
 * editProfileSchema monitor the edit profile request body, and return an error if any of requirements doesn't match with it
 */
module.exports.editProfileSchema = joi
  .object({
    name: joi.string().escapeHTML().required(),
    email: joi
      .string()
      .escapeHTML()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "fr", "net"] } })
      .required(),
    actualPassword: joiPassword
      .string()
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .minOfSpecialCharacters(1)
      .noWhiteSpaces()
      .min(8)
      .required(),
    newPassword: joiPassword
      .string()
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .minOfSpecialCharacters(1)
      .noWhiteSpaces()
      .min(8)
      .required(),
  })
  .required();

/**
 * postShelterSchema monitor the shelter request body, and return an error if any of requirements doesn't match with it
 */
module.exports.postShelterImage = joi
  .object({
    title: joi.string().escapeHTML().required(),
    image: joi.binary(),
    phone: joiPhoneNumber
      .string({ defaultCountry: "FR", format: "national" })
      .phoneNumber(),
    description: joi.object({
      text: joi.string().required(),
      lang: joi.string().escapeHTML().required(),
    }),
    address: joi.string().escapeHTML().required(),
    lat: joi.number().required(),
    lon: joi.number().required(),
    categories: joi.array().items(joi.number().min(1).required()),
  })
  .required();

/**
 * shelterDescriptionSchema monitor the shelter description request body, and return an error if any of requirements doesn't match with it
 */
module.exports.putShelterDescriptionSchema = joi
  .object({
    description: joi.object({
      text: joi.string().required(),
      lang: joi.string().escapeHTML().required(),
    }),
  })
  .required();

/**
 * postEventSchema monitor the event request body, and return an error if any of requirements doesn't match with it
 */
module.exports.postEventSchema = joi
  .object({
    title: joi.string().escapeHTML().required(),
    description: joi.string().escapeHTML().required(),
    eventStart: joi.date().required(),
  })
  .required();

/**
 * confirmEmailSchema monitor the email confirmation request body, and return an error if any of requirements doesn't match with it
 */
module.exports.confirmEmailSchema = joi
  .object({
    id: joi.string().escapeHTML().required(),
    token: joi.string().escapeHTML().required(),
  })
  .required();

/**
 * emailSchema monitor the forget password request body, and return an error if any of requirements doesn't match with it
 */
module.exports.emailSchema = joi
  .object({
    email: joi
      .string()
      .escapeHTML()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "fr", "net"] } }),
  })
  .required();

/**
 * passwordSchema monitor the reset password request body, and return an error if any of requirements doesn't match with it
 */
module.exports.passwordSchema = joi
  .object({
    password: joiPassword
      .string()
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .minOfSpecialCharacters(1)
      .noWhiteSpaces()
      .min(8)
      .required(),
  })
  .required();

/**
 * updatePasswordSchema monitor the update password request body, and return an error if any of requirements doesn't match with it
 */
module.exports.updatePasswordSchema = joi
  .object({
    actualPassword: joiPassword
      .string()
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .minOfSpecialCharacters(1)
      .noWhiteSpaces()
      .min(8)
      .required(),
    newPassword: joiPassword
      .string()
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .minOfSpecialCharacters(1)
      .noWhiteSpaces()
      .min(8)
      .required(),
  })
  .required();

/**
 * postBookingSchema monitor the post booking request body, and return an error if any of requirements doesn't match with it
 */
module.exports.postBookingSchema = joi
  .object({
    shelterId: joi.string().escapeHTML().required(),
    name: joi.string().escapeHTML().required(),
    phone: joiPhoneNumber
      .string({ defaultCountry: "FR", format: "national" })
      .phoneNumber()
      .required(),
    numberOfPerson: joi.number().min(1).max(4).required(),
    email: joi
      .string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "fr", "net"] } })
      .required(),
    from: joi.date(),
    to: joi.date(),
    informations: joi.string().escapeHTML().allow(""),
    categories: joi.array().items(joi.number().min(1).required()),
  })
  .required();

/**
 * putRatesSchema monitor the put rates request body, and return an error if any of requirements doesn't match with it
 */
module.exports.putRatesSchema = joi
  .object({
    price1: joi.number().max(9999).required(),
    price2: joi.number().max(9999).required(),
    price3: joi.number().max(9999).required(),
  })
  .required();

/**
 * diabledDatesSchema monitor the disabled dates request body, and return an error if any of requirements doesn't match with it
 */
module.exports.disabledDatesSchema = joi
  .object({
    shelterId: joi.string().escapeHTML().required(),
    selectedDate: joi.date(),
  })
  .required();
