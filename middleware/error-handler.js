const { custom } = require("joi");
const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    //set default
    StatusCodes: err.StatusCodes || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "OOPS! Something went wrong try again...",
  };

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message });
  // }
  if (err.name === "ValidationError") {
    console.log(Object.values(err.errors));
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    customError.StatusCodes = 400;
  }
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )},Please choose another value`;
    customError.StatusCodes = 400;
  }

  if (err.name === "CastError") {
    customError.msg = `No items found with id : ${err.value}`;
    customError.StatusCodes = 404;
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  return res.status(customError.StatusCodes).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
