import Joi from 'joi';

const stringFieldValidation = Joi.string();

export const passwordsMatchValidation = Joi.object({
  password: stringFieldValidation,
  repeatPassword: stringFieldValidation
    .valid(Joi.ref('password'))
    .messages({ 'any.only': 'Passwords must match' }),
});

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
