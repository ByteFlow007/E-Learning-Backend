//Custom Response Object for Every Response
module.exports = class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.message = message;
    this.success = true;
    this.data = data;
  }
};
