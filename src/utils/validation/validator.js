const fs = require('fs');
const logger = require('../../common/logging');

const {
  BAD_REQUEST,
  UNPROCESSABLE_ENTITY,
  FORBIDDEN
} = require('http-status-codes');

const errorResponse = errors => {
  return {
    status: 'failed',
    errors: errors.map(err => {
      const { path, message } = err;
      return { path, message };
    })
  };
};

const validator = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);
    if (error) {
      if (req.file) {
        fs.unlink(req.file.path, err => {
          console.log(err);
          logger.info(err);
        });
      }
      res
        .status(property === 'body' ? UNPROCESSABLE_ENTITY : BAD_REQUEST)
        .json({ error: errorResponse(error.details) });
    } else {
      return next();
    }
  };
};

const userIdValidator = (req, res, next) => {
  if (req.userId !== req.params.id) {
    res.sendStatus(FORBIDDEN);
  } else {
    return next();
  }
};

module.exports = { validator, userIdValidator };
