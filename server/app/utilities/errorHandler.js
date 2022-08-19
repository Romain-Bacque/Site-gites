const { appendFile } = require("fs");
const path = require("path");
const ExpressError = require("./ExpressError");

const errorHandler = {
  /**
   * Méthode de déclenchement d'une erreur si erreur 404
   */
  notFound(_, __, next) {
    next(new ExpressError("Not Found", 404));
  },
  manage(err, _, res, __) {
    const now = new Date();
    const fileName = `${now.getFullYear()}-${
      now.getMonth() + 1
    }-${now.getDate()}.log`;
    const filePath = path.join(__dirname, `../../log/${fileName}`);

    const errorMessage =
      now.getHours() + ":" + now.getMinutes() + " " + err + "\r";
    appendFile(filePath, errorMessage, (error) => {});

    res.status(err.statusCode).json({ message: err.message });
  },
};

module.exports = errorHandler;
