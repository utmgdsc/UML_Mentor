function ErrorHandler(err, req, res, next) {
  console.error("Error", err);
  let code = 500;
  if (err instanceof HandledError) {
    code = err.code;
  }
  res.status(code).json({
    error: err.message,
  });
}

function AsyncWrapController(controller) {
  for (const key in controller) {
    if (typeof controller[key] === "function") {
      // console.log(`Changed ${key} to async.`);
      controller[key] = AsyncDecorator(controller[key]);
    }
  }
}

function AsyncDecorator(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((e) => next(e));
  };
}

class HandledError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

module.exports = { ErrorHandler, AsyncWrapController, HandledError };
