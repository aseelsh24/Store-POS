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

describe('Password Validation', () => {
  test('should reject password shorter than 10 characters', () => {
    const result = validatePasswordStrength('Short1');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('at least 10 characters');
  });

  test('should reject password without uppercase letter', () => {
    const result = validatePasswordStrength('lowercase123');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('uppercase');
  });

  test('should reject password without lowercase letter', () => {
    const result = validatePasswordStrength('UPPERCASE123');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('lowercase');
  });

  test('should reject password without number', () => {
    const result = validatePasswordStrength('NoNumbersHere');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('number');
  });

  test('should accept strong password', () => {
    const result = validatePasswordStrength('SecurePass123');
    expect(result.valid).toBe(true);
  });

  test('should accept password with special characters', () => {
    const result = validatePasswordStrength('Str0ng!P@ssw0rd');
    expect(result.valid).toBe(true);
  });
});

module.exports = { validatePasswordStrength };
