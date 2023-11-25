export default (validatorSchema, data) => {
  const { error } = validatorSchema.validate(data);

  if (error)
    return {
      msg: error,
      code: 'BAD_USER_INPUT',
    };
};
