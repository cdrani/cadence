import { AuthError, MismatchStateError } from "~types/error"
import { generateState, generateCodeChallenge } from "~utils/auth"
import type { AuthQueryParam, RedirectQueryParam, TokenResponse, TokenRequestBody, RefreshedTokenRequestBody } from './types'

const SPOTIFY_AUTH_BASE = 'https://accounts.spotify.com/authorize?'
const SPOTIFY_AUTH_TOKEN = 'https://accounts.spotify.com/api/token'

export const authorize = async (params: AuthQueryParam): Promise<RedirectQueryParam> => {
    const searchParams = (new URLSearchParams(params as Required<AuthQueryParam>)).toString()
    const url = `${SPOTIFY_AUTH_BASE}${searchParams}`

    return new Promise((resolve, reject) => {
        chrome.identity.launchWebAuthFlow({
            url,
            interactive: true
        }, responseUrl => {
            if (!responseUrl) {
                reject(); return
            }

            const url = new URL(responseUrl)
            resolve(Object.fromEntries(url.searchParams))
        })
    })
}

export const getTokens = async (params: TokenRequestBody | RefreshedTokenRequestBody): Promise<TokenResponse> => {
    const body = new URLSearchParams(params)
    const response =  await  fetch(`${SPOTIFY_AUTH_TOKEN}`, { method: 'POST', body })
    const data = await response.json()
    return data
}


export const authenticate = async (): Promise<TokenResponse | AuthError> => {
    const client_id = process.env.PLASMO_PUBLIC_CLIENT_ID
    const redirect_uri = process.env.PLASMO_PUBLIC_REDIRECT_URI

    const state = generateState()
    const { code_verifier, code_challenge } = await generateCodeChallenge()

    const { code, error, state: response_state } = await authorize({
        state,
        client_id,
        redirect_uri,
        code_challenge,
        response_type: 'code',
        code_challenge_method: 'S256',
        scope: 'user-read-email user-read-private',
    })

    if (error || !code) {
        return new AuthError(error)
    }

    if (state !== response_state) {
        return new MismatchStateError('Value of stored `state` does not match response `state`')
    }

    return await getTokens({
        code,
        client_id,
        redirect_uri,
        code_verifier,
        grant_type: 'authorization_code',
    })
}
