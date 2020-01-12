const joi = require('@hapi/joi');

const userIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const emailSchema = joi.string().email();
const nameSchema = joi.string().max(100);
const passwordSchema = joi.string();
const isAdminSchema = joi.boolean();

const createUserSchema = {
  name: nameSchema.required(),
  email: emailSchema.required(),
  password: passwordSchema.required(),
  isAdmin: isAdminSchema
};

module.exports = {
  userIdSchema,
  createUserSchema
};