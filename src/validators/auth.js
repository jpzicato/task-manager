import Joi from 'joi';

const stringFieldValidation = Joi.string();

export const passwordsMatchValidation = Joi.object({
  password: stringFieldValidation,
  repeatPassword: stringFieldValidation
    .valid(Joi.ref('password'))
    .messages({ 'any.only': 'Passwords must match' }),
});
