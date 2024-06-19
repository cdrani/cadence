export interface AuthQueryParam {
    client_id: string,
    response_type: 'code',
    redirect_uri: string,
    code_challenge_method: 'S256'
    code_challenge: string,
    state?: string,
    scope?: string
}

export interface RedirectQueryParam {
    code?: string,
    error?: string,
    state?: string,
}

export interface RefreshedTokenRequestBody extends Record<string, string> {
    client_id: string,
    grant_type: 'refresh_token',
    refresh_token: string,
}

export interface TokenRequestBody extends Record<string, string> {
    client_id: string,
    grant_type: 'authorization_code',
    code: string,
    redirect_uri: string,
    code_verifier: string,
}

export interface TokenResponse {
    access_token: string,
    token_type: string,
    scope: string,
    expires_in: string,
    refresh_token: string
}
