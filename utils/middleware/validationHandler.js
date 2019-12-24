const boom = require('@hapi/boom');
const joi = require('@hapi/joi');

function validate(data, schema) {
  const { error } = joi.object(schema).validate(data);
  return error;
}

function validationHandler(schema, check = 'body') {
  return function (req, res, next) {
    const err = validate(req[check], schema);

    err ? next(boom.badRequest(err)) : next();
  }
}

module.exports = validationHandler;