import debug from "debug";
import { Request, Response, NextFunction } from "express";
import { ObjectSchema, ValidationError } from "joi";
import ExpressError from "../utilities/ExpressError";

const debugReqBody = debug("validate:requestBody");
const debugErr = debug("validate:error");

/**
 * Function to validate a part of the request (body, query, or params)
 * @param schema - Joi schema to heed
 * @param property - Which property to validate ('body', 'query', or 'params')
 */
export const validate = (
  schema: ObjectSchema,
  property: "body" | "query" | "params" = "body"
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error }: { error?: ValidationError } = schema.validate(req[property]);

    if (error) {
      const message = error.details.map((elt) => elt.message).join(", ");

      debugReqBody(req[property]);
      debugErr(error);
      res.sendStatus(400);
      throw new ExpressError(message, 400);
    } else {
      next();
    }
  };
};
