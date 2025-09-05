import debugLib from "debug";
import { appendFile } from "fs";
import path from "path";
import ExpressError from "./ExpressError";
import { Request, Response, NextFunction } from "express";

const debug = debugLib("errorHandler");

const errorHandler = {
  /**
   * Method that triggers an error if a 'not found' error occurs
   */
  notFound(_: Request, __: Response, next: NextFunction) {
    next(new ExpressError("Not Found", 404));
  },
  /**
   * Method that manages all other errors
   */
  manage(err: any, _: Request, res: Response, __: NextFunction) {
    // creation of log file
    const now = new Date();
    const fileName = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}.log`;
    const filePath = path.join(__dirname, `../../log/${fileName}`);
    const errorMessage = `${now.getHours()}:${now.getMinutes()} ${err}\r`;

    // Append the error message to the log file
    appendFile(filePath, errorMessage, (error) => {
      if (error) debug(error);
    });

    res.sendStatus(500);
  },
};

export default errorHandler;
