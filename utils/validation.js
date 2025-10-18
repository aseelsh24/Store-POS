function validatePasswordStrength(password) {
  if (!password || password.length < 10) {
    return { valid: false, message: 'Password must be at least 10 characters long' };
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
  if (!passwordRegex.test(password)) {
    return {
      valid: false,
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    };
  }

  return { valid: true, message: 'Password is strong' };
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Invalid email format' };
  }
  return { valid: true, message: 'Email is valid' };
}

module.exports = {
  validatePasswordStrength,
  validateEmail,
};
