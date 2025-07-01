class ApiError extends Error {
  constructor(
    statusCode,
    message = "something went wrong and error message was not provided",
    errors = [],
    stackTrace = []
  ) {
    super(message);
    this.stack = stackTrace;
    this.success = false;
    this.errors = errors;
    this.data = null;
    this.statusCode = statusCode;

    if (stackTrace) {
      this.stack = stackTrace;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };

