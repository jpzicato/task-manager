import Joi from 'joi';

const stringFieldValidation = Joi.string();

export const updateUserValidation = Joi.object({
  name: stringFieldValidation.min(3).max(30),
  email: stringFieldValidation,
  password: stringFieldValidation
    .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/)
    .messages({
      'string.pattern.base':
        'The password must contain at least 8 characters including at least 1 uppercase, 1 lowercase, and one number.',
    }),
});
