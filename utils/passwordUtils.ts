// src/passwordUtils.ts
import * as bcrypt from 'bcrypt';

/**
 * Password utility functions for hashing and comparing passwords
 */
export class PasswordUtils {
  /**
   * Default number of salt rounds for bcrypt
   */
  private static readonly SALT_ROUNDS = 10;

  /**
   * Hashes a password using bcrypt
   * @param plainPassword - The plain text password to hash
   * @param saltRounds - Number of salt rounds to use (default: 10)
   * @returns Promise resolving to the hashed password
   */
  public static async hashPassword(
    plainPassword: string, 
    saltRounds: number = PasswordUtils.SALT_ROUNDS
  ): Promise<string> {
    return bcrypt.hash(plainPassword, saltRounds);
  }

  /**
   * Compares a plain text password with a hash
   * @param plainPassword - The plain text password to check
   * @param hashedPassword - The hashed password to compare against
   * @returns Promise resolving to true if passwords match, false otherwise
   */
  public static async comparePassword(
    plainPassword: string, 
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}