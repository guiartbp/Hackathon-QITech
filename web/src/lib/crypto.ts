import crypto from 'crypto';
import CryptoJS from 'crypto-js';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // For GCM, this is always 16
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const TAG_POSITION = SALT_LENGTH + IV_LENGTH;
const ENCRYPTED_POSITION = TAG_POSITION + TAG_LENGTH;

/**
 * Encrypts text with AES-256-CBC using the provided encryption key
 * @param text The text to encrypt
 * @param encryptionKey The encryption key (should be 32 bytes)
 * @returns Base64 encoded encrypted string
 */
export function encrypt(text: string, encryptionKey?: string): string {
  const key = encryptionKey || process.env.ENCRYPTION_KEY;
  
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is required');
  }

  if (key.length !== 32) {
    throw new Error('Encryption key must be exactly 32 characters long');
  }

  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher('aes-256-cbc', key);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Combine IV and encrypted data
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Decrypts text encrypted with the encrypt function
 * @param encryptedData Hex encoded encrypted string with IV
 * @param encryptionKey The encryption key (should be 32 bytes)  
 * @returns Decrypted plaintext string
 */
export function decrypt(encryptedData: string, encryptionKey?: string): string {
  const key = encryptionKey || process.env.ENCRYPTION_KEY;
  
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is required');
  }

  if (key.length !== 32) {
    throw new Error('Encryption key must be exactly 32 characters long');
  }

  try {
    const parts = encryptedData.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted data format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];
    
    const decipher = crypto.createDecipher('aes-256-cbc', key);
    
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Legacy decrypt function for backward compatibility
 */
export function decryptLegacy(encryptedText: string): string {
  try {
    const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';
    const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Erro ao descriptografar:', error);
    throw new Error('Failed to decrypt token');
  }
}

/**
 * Generates a secure 32-character encryption key
 * @returns Random 32-character string suitable for encryption
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Safely encrypts Stripe tokens for database storage
 * @param accessToken The access token to encrypt
 * @param refreshToken The refresh token to encrypt (optional)
 * @returns Object with encrypted tokens
 */
export function encryptStripeTokens(
  accessToken: string, 
  refreshToken?: string
): { accessToken: string; refreshToken?: string } {
  return {
    accessToken: encrypt(accessToken),
    refreshToken: refreshToken ? encrypt(refreshToken) : undefined,
  };
}

/**
 * Safely decrypts Stripe tokens from database
 * @param encryptedAccessToken The encrypted access token
 * @param encryptedRefreshToken The encrypted refresh token (optional)
 * @returns Object with decrypted tokens
 */
export function decryptStripeTokens(
  encryptedAccessToken: string,
  encryptedRefreshToken?: string | null
): { accessToken: string; refreshToken?: string } {
  return {
    accessToken: decrypt(encryptedAccessToken),
    refreshToken: encryptedRefreshToken ? decrypt(encryptedRefreshToken) : undefined,
  };
}

/**
 * Utility to validate encryption key format
 * @param key The key to validate
 * @returns boolean indicating if key is valid
 */
export function isValidEncryptionKey(key: string): boolean {
  return typeof key === 'string' && key.length === 32;
}