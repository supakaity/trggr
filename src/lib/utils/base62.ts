const charset = '7LxNw3ZWa2XkY0TvQJH8RyUm1KPo5Ffr9IbVcSGd4AqCpEn6BgiMsDhOjtzule';
const b256 = BigInt(256);
const b255 = BigInt(255);
const b62 = BigInt(62);
const b0 = BigInt(0);

export function base62Encode(input: string | Uint8Array): string {
    const uint8Array = typeof input === 'string'
        ? new TextEncoder().encode(input)
        : input;

    let result = '';
    let number = b255;

    for (let i = 0; i < uint8Array.length; i++) {
        number = number * b256 + BigInt(uint8Array[i]);
    }
    number = number * b256 + b255;

    while (number > 0) {
        result = charset[Number(number % b62)] + result;
        number = number / b62;
    }

    return result;
}

export function base62DecodeRaw(encoded: string): Uint8Array | undefined {
    let number = b0;
    for (let i = 0; i < encoded.length; i++) {
        number = number * b62 + BigInt(charset.indexOf(encoded[i]));
    }
    const result: number[] = [];
    while (number > 0) {
        result.unshift(Number(number % b256));
        number = number / b256;
    }
    const uint8Array = new Uint8Array(result);
    const n = uint8Array.length;

    if (n < 2 || uint8Array[0] !== 255 || uint8Array[n - 1] !== 255) {
        return undefined;
    }

    const sliced = uint8Array.slice(1, n - 1);
    return sliced;
}

export function base62Decode(encoded: string): string | undefined {
    const uint8Array = base62DecodeRaw(encoded);
    if (!uint8Array) {
        return undefined;
    }
    return new TextDecoder().decode(uint8Array);
}