import { gcm } from '@noble/ciphers/aes.js';
import { pbkdf2 } from '@noble/hashes/pbkdf2.js';
import { sha256 } from '@noble/hashes/sha2.js';
import {
  bytesToHex,
  hexToBytes,
  utf8ToBytes,
} from '@noble/hashes/utils.js';
import * as ExpoCrypto from 'expo-crypto';

const PBKDF2_ITERATIONS = 100_000;
const SALT_BYTES = 16;
const IV_BYTES = 12;

export interface EncryptedPayload {
  salt: string;
  iv: string;
  ciphertext: string;
}

async function randomBytes(length: number): Promise<Uint8Array> {
  return ExpoCrypto.getRandomBytesAsync(length);
}

function deriveKey(keyphrase: string, salt: Uint8Array): Uint8Array {
  return pbkdf2(sha256, utf8ToBytes(keyphrase), salt, {
    c: PBKDF2_ITERATIONS,
    dkLen: 32,
  });
}

export function deriveSyncId(keyphrase: string): string {
  return bytesToHex(sha256(utf8ToBytes(keyphrase)));
}

export async function encryptWithKeyphrase(
  keyphrase: string,
  plaintext: string,
): Promise<EncryptedPayload> {
  const salt = await randomBytes(SALT_BYTES);
  const iv = await randomBytes(IV_BYTES);
  const key = deriveKey(keyphrase, salt);
  const aes = gcm(key, iv);
  const ciphertext = aes.encrypt(utf8ToBytes(plaintext));

  return {
    salt: bytesToHex(salt),
    iv: bytesToHex(iv),
    ciphertext: bytesToHex(ciphertext),
  };
}

export function decryptWithKeyphrase(
  keyphrase: string,
  payload: EncryptedPayload,
): string {
  const salt = hexToBytes(payload.salt);
  const iv = hexToBytes(payload.iv);
  const ciphertext = hexToBytes(payload.ciphertext);
  const key = deriveKey(keyphrase, salt);
  const aes = gcm(key, iv);
  const plaintext = aes.decrypt(ciphertext);
  return new TextDecoder().decode(plaintext);
}
