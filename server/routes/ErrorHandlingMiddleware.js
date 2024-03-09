function ErrorHandler(err, req, res, next) {
  console.error("Error", err);
  res.status(500).json({
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

module.exports = { ErrorHandler, AsyncWrapController };
