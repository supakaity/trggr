import { xchacha20poly1305 } from '@noble/ciphers/chacha';
import { utf8ToBytes, bytesToUtf8 } from '@noble/ciphers/utils';
import { randomBytes } from '@noble/ciphers/webcrypto';
import { base62DecodeRaw, base62Encode } from '$lib/utils/base62';

export function encryptObject(obj: unknown) {
    const jsonString = JSON.stringify(obj);

    const key = randomBytes(32);
    const nonce = randomBytes(24);
    const chacha = xchacha20poly1305(key, nonce);
    const data = utf8ToBytes(jsonString);
    const ciphertext = chacha.encrypt(data);
    
    return {
        encoded: base62Encode(ciphertext),
        key: base62Encode(key) + ':' + base62Encode(nonce)
    };
}

export function getKeyFromUrl(url?: string) {
    return url?.split('#').pop();
}

export function splitKeyFromUrl(url?: string) {
    return getKeyFromUrl(url)?.split(':') ?? [];
}

export function decryptObject(encoded: string, key: string): unknown | undefined {
    if (!encoded || !key) return undefined;
    const [keyEncoded, nonceEncoded] = splitKeyFromUrl(key);
    if (!keyEncoded || !nonceEncoded) return undefined;
    const keyBytes = base62DecodeRaw(keyEncoded);
    const nonceBytes = base62DecodeRaw(nonceEncoded);
    const decoded = base62DecodeRaw(encoded);
    if (
        !keyBytes || !nonceBytes || !decoded ||
        keyBytes.length !== 32 || nonceBytes.length !== 24 ||
        decoded.length < 1
    ) return undefined;

    const chacha = xchacha20poly1305(keyBytes, nonceBytes);
    const data = chacha.decrypt(decoded);
    return JSON.parse(bytesToUtf8(data));
}