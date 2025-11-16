import HTTP_ERRORS from "../consts.js";

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ?? 500;
  switch (statusCode) {
    case HTTP_ERRORS["BAD REQUEST"]:
      res.json({
        title: "malformed body",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case HTTP_ERRORS.FORBIDDEN:
      res.json({
        title: "forbidden",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case HTTP_ERRORS["NOT FOUND"]:
      res.json({
        title: "not found",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case HTTP_ERRORS["METHOD NOT ALLOWED"]:
      res.json({
        title: "wrong http method",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case HTTP_ERRORS["RATE LIMIT"]:
      res.json({
        title: "rate limit exceeded",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    default:
      res.json({
        title: "Internal Server Error",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
  }
  next(err);
};

export default errorHandler;
