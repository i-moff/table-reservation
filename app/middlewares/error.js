const httpStatus = require('http-status');

module.exports = (err, req, res, next) => {
  const response = {
    error: err.message,
  };

  res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR);
  res.json(response);
  res.end();
};

