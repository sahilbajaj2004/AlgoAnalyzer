const throwValidation = (msg) => {
  const err = new Error(msg);
  err.isValidationError = true;
  throw err;
}

module.exports = throwValidation;
