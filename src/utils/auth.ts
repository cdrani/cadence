const base64encode = (input: ArrayBuffer) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
}

const sha256 = async (str: string) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(str)
    return crypto.subtle.digest('SHA-256', data)
}

export const generateCodeVerifier = (length: number) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const values = crypto.getRandomValues(new Uint8Array(length))
    return values.reduce((acc, x) => acc + possible[x % possible.length], "")
}

export const generateState = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export const generateCodeChallenge = async (): Promise<{ code_challenge: string, code_verifier: string }> => {
    const code_verifier = generateCodeVerifier(64)
    const hashed = await sha256(code_verifier)
    const code_challenge = base64encode(hashed)
    return { code_verifier, code_challenge }
}
