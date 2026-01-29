import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

/**
 * AES-256-GCM encryption utility for sensitive PII data
 * (e.g., KTP numbers, bank account numbers).
 *
 * Encrypted format: base64(iv:authTag:ciphertext)
 *
 * IMPORTANT: Only use server-side. Never import in client components.
 */

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96-bit IV recommended for GCM
const AUTH_TAG_LENGTH = 16;

function getEncryptionKey(): Buffer {
  if (typeof window !== "undefined") {
    throw new Error(
      "Encryption utilities must only be used in server-side code."
    );
  }

  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error(
      "Missing ENCRYPTION_KEY environment variable. " +
        "Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
    );
  }

  const keyBuffer = Buffer.from(key, "hex");
  if (keyBuffer.length !== 32) {
    throw new Error(
      "ENCRYPTION_KEY must be a 64-character hex string (32 bytes). " +
        "Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
    );
  }

  return keyBuffer;
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Returns a base64-encoded string containing IV, auth tag, and ciphertext.
 *
 * @param plaintext - The string to encrypt
 * @returns Encrypted string in base64 format, or null if plaintext is null/undefined
 */
export function encrypt(plaintext: string | null | undefined): string | null {
  if (plaintext == null || plaintext === "") {
    return null;
  }

  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  // Combine IV + authTag + ciphertext into a single buffer, then base64-encode
  const combined = Buffer.concat([iv, authTag, encrypted]);
  return combined.toString("base64");
}

/**
 * Decrypts a string that was encrypted with `encrypt()`.
 *
 * @param encryptedText - The base64-encoded encrypted string
 * @returns Decrypted plaintext string, or null if input is null/undefined
 */
export function decrypt(encryptedText: string | null | undefined): string | null {
  if (encryptedText == null || encryptedText === "") {
    return null;
  }

  const key = getEncryptionKey();
  const combined = Buffer.from(encryptedText, "base64");

  if (combined.length < IV_LENGTH + AUTH_TAG_LENGTH + 1) {
    throw new Error("Invalid encrypted data: too short");
  }

  const iv = combined.subarray(0, IV_LENGTH);
  const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const ciphertext = combined.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

  const decipher = createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}

/**
 * Masks a sensitive string for display purposes.
 * Shows only the last N characters, replacing the rest with asterisks.
 *
 * @param value - The string to mask
 * @param visibleChars - Number of trailing characters to show (default: 4)
 * @returns Masked string (e.g., "****5678") or null if input is null
 */
export function maskSensitive(
  value: string | null | undefined,
  visibleChars: number = 4
): string | null {
  if (value == null || value === "") {
    return null;
  }

  if (value.length <= visibleChars) {
    return "*".repeat(value.length);
  }

  const masked = "*".repeat(value.length - visibleChars);
  return masked + value.slice(-visibleChars);
}
