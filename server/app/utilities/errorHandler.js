const debug = require("debug")("errorHandler");
const { appendFile } = require("fs");
const path = require("path");
const ExpressError = require("./ExpressError");

const errorHandler = {
  /**
   * Method that trigger an error if a 'not found' error occurs
   */
  notFound(_, __, next) {
    next(new ExpressError("Not Found", 404));
  },
  /**
   * Method that manage all other errors
   */
  manage(err, _, res, __) {
    // creation of log file
    const now = new Date();
    const fileName = `${now.getFullYear()}-${
      now.getMonth() + 1
    }-${now.getDate()}.log`;
    const filePath = path.join(__dirname, `../../log/${fileName}`);
    const errorMessage =
      now.getHours() + ":" + now.getMinutes() + " " + err + "\r";
    appendFile(filePath, errorMessage, (error) => {
      debug(error);
    });

    res.sendStatus(500);
  },
};

module.exports = errorHandler;
