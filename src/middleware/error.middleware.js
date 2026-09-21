import env from "../config/env.js";

const errorMiddleware = (err, req, res, next) => {
  console.error("ERROR:", err);

  const statusCode = err.statusCode || 500;

  const response = {
    success: false,
    message:
      err.message || "Internal server error",
  };

  if (env.nodeEnv === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export default errorMiddleware;