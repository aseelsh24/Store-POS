const bcrypt = require('bcrypt');

describe('Bcrypt Password Hashing', () => {
  test('should hash password with cost factor 12', async () => {
    const password = 'TestPassword123';
    const hash = await bcrypt.hash(password, 12);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(50);
  });

  test('should verify correct password', async () => {
    const password = 'TestPassword123';
    const hash = await bcrypt.hash(password, 12);

    const isMatch = await bcrypt.compare(password, hash);
    expect(isMatch).toBe(true);
  });

  test('should reject incorrect password', async () => {
    const password = 'TestPassword123';
    const wrongPassword = 'WrongPassword123';
    const hash = await bcrypt.hash(password, 12);

    const isMatch = await bcrypt.compare(wrongPassword, hash);
    expect(isMatch).toBe(false);
  });

  test('should produce different hashes for same password', async () => {
    const password = 'TestPassword123';
    const hash1 = await bcrypt.hash(password, 12);
    const hash2 = await bcrypt.hash(password, 12);

    expect(hash1).not.toBe(hash2);
    expect(await bcrypt.compare(password, hash1)).toBe(true);
    expect(await bcrypt.compare(password, hash2)).toBe(true);
  });
});
