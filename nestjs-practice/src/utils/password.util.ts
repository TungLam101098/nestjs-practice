import * as bcrypt from 'bcrypt';

/**
 * Hashes a plain text password using bcrypt algorithm
 *
 * @param plainTextPassword - The plain text password to be hashed
 * @returns A Promise that resolves to the hashed password string
 * @throws {Error} If the password hashing process fails
 */
export const hashPassword = async (
  plainTextPassword: string,
): Promise<string> => {
  const salt = await bcrypt.genSalt();

  return bcrypt.hash(plainTextPassword, salt);
};

/**
 * Checks if a plain text password matches its hashed version
 *
 * @param plainTextPassword - The password in plain text to check
 * @param hashedPassword - The hashed password to compare against
 * @returns A promise that resolves to `true` if the password is valid, `false` otherwise
 */
export const isPasswordValid = async (
  plainTextPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};
