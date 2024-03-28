function LoggingMiddleware(req, res, next) {
  console.log(`Requesting ${req.originalUrl} /w`, req.body);
  next();
}

module.exports = LoggingMiddleware;
