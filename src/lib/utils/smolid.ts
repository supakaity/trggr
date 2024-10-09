export const smolId = (): string => {
    const alphabet = '6789BCDFGHJKLMNPQRTWbcdfghjkmnpqrtwz';
    const base = alphabet.length;
    const epochStart = new Date('2020-01-01').getTime();
    const now = new Date().getTime();
    const minutesSinceEpoch = Math.floor((now - epochStart) / (60 * 1000));

    let timestamp = '';
    let n = minutesSinceEpoch;
    while (n > 0) {
        timestamp = alphabet[n % base] + timestamp;
        n = Math.floor(n / base);
    }

    let randomPart = '';
    for (let i = 0; i < 6; i++) {
        randomPart += alphabet[Math.floor(Math.random() * base)];
    }

    return timestamp + randomPart;
}
