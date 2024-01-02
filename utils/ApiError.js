//Custom Error Object for Every Error
module.exports = class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong!",
    error = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
    this.error = error;
    this.errMessage = message;

    if (stack) {
      this.stack = stack;
    }
  }
};
