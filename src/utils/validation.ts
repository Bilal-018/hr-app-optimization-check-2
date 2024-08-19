// eslint-disable-next-line no-useless-escape
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; // /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

export const isValidateEmail = (email: any) => {
  return emailRegex.test(email);
};

const isValidString = (string: any) => {
  if (typeof string === 'number') return string > 0;
  if (Array.isArray(string)) return true;
  return string && string.length > 0 && string.trim().length > 0;
};

export const validateStringArray = (array: any) => {
  let errors: any = [];
  array.forEach((item: any) => {
    if (!isValidString(item)) {
      errors.push(item);
    }
  });
  return errors;
};

export const validateProfileData = (profileData: any) => {
  console.log('profileData', profileData);
  const emails = [
    {
      name: 'personalEmailId',
      value: profileData.personalEmailId,
    },
    {
      name: 'email',
      value: profileData.emergencyContactDto.email,
    },
  ];

  let errors: any = [];

  Object.keys(profileData).forEach((key) => {
    // if its not an object then check for string validation if not valid then push error to errors array
    if (typeof profileData[key] !== 'object') {
      if (!isValidString(profileData[key])) {
        errors.push(key);
      }
    } else if (profileData[key] !== null) {
      Object.keys(profileData[key]).forEach((k) => {
        if (!isValidString(profileData[key][k])) {
          errors.push(k);
        }
      });
    }
  });

  emails.forEach((email) => {
    if (!isValidateEmail(email.value)) {
      errors.push(email.name);
    }
  });

  return errors;
};

// export const errorHelperText = (error) => {
//   if (error) {
//     return (
//       <Typography variant='caption' color='error'>
//         {error}
//       </Typography>
//     )
//   } else {
//     return null;
//   }
// };

// export const errorHelperText = (error: string | null | undefined) => {
export const errorHelperText = (error: string | null | undefined) => {
  if (error) {
    return error;
  } else {
    return null;
  }
};

export const validateBankDetails = (bankDetails: any) => {
  let errors: any = [];

  Object.keys(bankDetails).forEach((key) => {
    if (!isValidString(bankDetails[key])) {
      errors.push(key);
    }
  });

  return errors;
};

export const validateEmployeeInfo = (state: any) => {
  const { roleNames, ...info } =
    state;

  let foundErrors = [];

  if (roleNames.length < 1) {
    foundErrors.push('roleNames');
  }

  Object.keys(info).forEach((key) => {
    if (!isValidString(info[key])) {
      foundErrors.push(key);
    }
  });
  if (info.lineManager <= 0) {
    foundErrors.push('lineManager');
  }

  if (foundErrors.length > 0) return foundErrors;

  if (!isValidateEmail(info.email)) {
    foundErrors.push('email');
  }

  return foundErrors;
};

// export const validateEmployeeInfo = (state) => {
//   const { errors, roleNames, ...info } = state;

//   let foundErrors = [];

//   if (roleNames.length < 1) {
//     foundErrors.push("roleNames");
//   }

//   Object.keys(info).forEach((key) => {
//     if (!isValidString(info[key])) {
//       foundErrors.push(key);
//     }
//   });
//   if (info.lineManager <= 0) {
//     foundErrors.push("lineManager");
//   }

//   if (foundErrors.length > 0) return foundErrors;

//   if (!isValidateEmail(info.email)) {
//     foundErrors.push("email");
//   }

//   return foundErrors;
// };

export const validateEmployeeResignationInfo = (state: any) => {
  const { lastWorkingDate, resignationDate, ...info } = state;

  let foundErrors = [];

  if (lastWorkingDate === null) {
    foundErrors.push('lastWorkingDate');
  }

  if (resignationDate === null) {
    foundErrors.push('resignationDate');
  }

  if (foundErrors.length > 0) return foundErrors;

  if (!isValidateEmail(info.email)) {
    foundErrors.push('email');
  }

  return foundErrors;
};

export const validateCalculate = (state: any) => {
  const errors: any = [];

  Object.keys(state).forEach((key) => {
    if (!isValidString(state[key])) {
      errors.push(key);
    }
  });

  return errors;
};

export const hasError = (name: any = '', errors: any) => errors.includes(name);

export const validatePassword = (password: any) => {
  const passwordError = {
    error: false,
    message: '',
  };

  if (password === '' || password.trim() === '') {
    passwordError.error = true;
    passwordError.message = 'Password is required';
  } else if (password.length < 8) {
    passwordError.error = true;
    passwordError.message = 'Password must be at least 8 characters';
  } else if (passwordRegex.test(password) === false) {
    passwordError.error = true;
    passwordError.message =
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character';
  } else {
    passwordError.error = false;
    passwordError.message = '';
  }

  return passwordError;
};

const validateEmail = (email: any) => {
  const emailError = {
    error: false,
    message: '',
  };

  if (email === '' || email.trim() === '') {
    emailError.error = true;
    emailError.message = 'Email is required';
  } else if (isValidateEmail(email) === false) {
    emailError.error = true;
    emailError.message = 'Invalid email';
  } else {
    emailError.error = false;
    emailError.message = '';
  }

  return emailError;
};

export const checkEmailPassword = (emailPass: any) => {
  const emailError = validateEmail(emailPass.email);
  const passwordError = validatePassword(emailPass.password);

  return {
    email: emailError,
    password: passwordError,
  };
};

export const validateLogin = (emailPass: any) => {
  const emailError = validateEmail(emailPass.email);
  const passwordError = {
    error: false,
    message: '',
  };

  if (emailPass.password === '' || emailPass.password.trim() === '') {
    passwordError.error = true;
    passwordError.message = 'Password is required';
  }

  return {
    email: emailError,
    password: passwordError,
  };
};

export const confirmPasswordValidation = (
  password: any,
  confirmPassword: any,
  oldPassword: any
) => {
  const passwordError = {
    error: false,
    message: '',
  };

  const confirmPasswordError = {
    error: false,
    message: '',
  };

  const oldPasswordError = {
    error: false,
    message: '',
  };

  if (oldPassword === '' || oldPassword.trim() === '') {
    oldPasswordError.error = true;
    oldPasswordError.message = 'Old password is required';
  }

  if (password === '' || password.trim() === '') {
    passwordError.error = true;
    passwordError.message = 'New password is required';
  } else if (validatePassword(password).error === true) {
    passwordError.error = true;
    passwordError.message = validatePassword(password).message;
  }

  if (confirmPassword === '' || confirmPassword.trim() === '') {
    confirmPasswordError.error = true;
    confirmPasswordError.message = 'Confirm password is required';
  }

  if (passwordError.error === false && confirmPasswordError.error === false) {
    if (password !== confirmPassword) {
      return {
        oldPassword: oldPasswordError,
        confirmPassword: {
          error: true,
          message: 'Confirm password does not match with new password',
        },
        password: passwordError,
      };
    }
  }

  return {
    confirmPassword: confirmPasswordError,
    password: passwordError,
    oldPassword: {
      error: oldPasswordError.error,
      message: oldPasswordError.message,
    },
  };
};
