// crypto.ts
const encoder = new TextEncoder();
const decoder = new TextDecoder();

export async function deriveKey(
    password: string, saltHex: string
): Promise<CryptoKey> {
    const salt = Uint8Array.from(
        atob(saltHex), c => c.charCodeAt(0)
    );
    const passKey = await crypto.subtle.importKey(
        "raw", encoder.encode(password),
        "PBKDF2", false, ["deriveKey"]
    );
    return crypto.subtle.deriveKey({
        name: "PBKDF2", salt, iterations: 100_000, hash: "SHA-256"
    },
        passKey,
        { name: "AES-GCM", length: 256 },
        false, ["encrypt", "decrypt"]
    );
}

export async function encryptDiary(
    key: CryptoKey, text: string
): Promise<{ ivHex: string, ctHex: string }> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv }, key, encoder.encode(text)
    );
    return {
        ivHex: btoa(String.fromCharCode(...iv)),
        ctHex: btoa(String.fromCharCode(...new Uint8Array(ct)))
    };
}

export async function decryptDiary(
    key: CryptoKey, ivHex: string, ctHex: string
): Promise<string> {
    const iv = Uint8Array.from(atob(ivHex), c => c.charCodeAt(0));
    const ct = Uint8Array.from(atob(ctHex), c => c.charCodeAt(0));
    const pt = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv }, key, ct
    );
    return decoder.decode(pt);
}