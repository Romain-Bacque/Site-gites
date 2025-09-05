import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Catch system error(s) occurring in an async controller method
 * @param controller - the controller to monitor
 */

type AsyncController = (req: Request, res: Response, next: NextFunction) => Promise<any>;

const catchAsync = (controller: AsyncController): RequestHandler => {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

export default catchAsync;
