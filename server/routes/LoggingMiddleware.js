function LoggingMiddleware(req, res, next) {
  console.log(`Requesting ${req.originalUrl} /w`, req.params, req.body);
  next();
}

module.exports = LoggingMiddleware;
