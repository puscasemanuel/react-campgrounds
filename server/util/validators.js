const isEmail = (email) => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) {
    return true;
  } else {
    return false;
  }
};

const isEmpty = (string) => {
  if (string.trim() === '') return true;
  else return false;
};

exports.validateAddCampground = (data) => {
  let errors = {};
  if (isEmpty(data.name)) {
    errors.title = 'Title must not be empty!';
  }

  if (data.name.length < 4) {
    errors.title = 'Title should have 4 or more chars';
  }

  if (isEmpty(data.image)) {
    errors.image = 'Image must not be empty';
  }

  if (isEmpty(data.price)) {
    errors.price = 'Camp should have a price or free';
  }

  if (isEmpty(data.description)) {
    errors.description = 'Description must not be empty';
  }

  if (data.description.length < 20) {
    errors.description = 'Description should have at least 20 chars';
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.validateSignup = (data) => {
  let errors = {};
  if (isEmpty(data.name)) {
    errors.name = 'Email is empty';
  }

  if (data.name.length < 4) {
    errors.name = 'Name should have 4 or more chars';
  }

  if (isEmpty(data.email)) {
    errors.email = 'Email is empty';
  }
  if (!isEmail(data.email)) {
    errors.email = 'Email not valid';
  }

  if (isEmpty(data.password)) {
    errors.password = 'Password is empty';
  }

  if (data.password.length < 8) {
    errors.password = 'Password must be at least 8 chars long';
  }

  if (isEmpty(data.passwordConfirm)) {
    errors.passwordConfirm = 'Please confirm the password';
  }

  if (data.passwordConfirm !== data.password) {
    errors.passwordMatch = `Passwords doesn't match`;
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.validateChangePassword = (data) => {
  let errors = {};

  if (isEmpty(data.oldPassword)) {
    errors.oldPassword = 'Old password is empty';
  }

  if (isEmpty(data.newPassword)) {
    errors.newPassword = 'New password is empty';
  }

  if (isEmpty(data.confirmNewPassword)) {
    errors.confirmNewPassword = 'Please confirm the new password';
  }

  if (data.confirmNewPassword !== data.newPassword) {
    errors.passwordMatch = 'Password does not match';
  }

  if (data.newPassword.length < 8) {
    errors.passwordLength = 'Password must be at least 8 chars long';
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};
