import debug from "debug";
import { Request, Response, NextFunction } from "express";
import { ObjectSchema, ValidationError } from "joi";
import ExpressError from "../utilities/ExpressError";

const debugReqBody = debug("validate:requestBody");
const debugErr = debug("validate:error");

/**
 * Function to validate the body of a request
 * @param schema - Joi schema to heed
 */
export const validate = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error }: { error?: ValidationError } = schema.validate(req.body);

    if (error) {
      const message = error.details.map((elt) => elt.message).join(", ");

      debugReqBody(req.body);
      debugErr(error);
      res.sendStatus(400);
      throw new ExpressError(message, 400);
    } else {
      next();
    }
  };
};
