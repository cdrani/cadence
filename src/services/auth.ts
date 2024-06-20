import { Storage } from '@plasmohq/storage'

import type { Profile } from "~types/session"
import { authenticate, exchangeTokens } from "~auth/auth"
import { AuthError, MismatchStateError } from "~types/error.d"

const storage = new Storage({ area: 'local' })

async function getProfile(access_token: string): Promise<Profile> {
    const response = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${access_token}` },
    })

    const data = await response.json()

    return {
        user_name: data.display_name,
        is_premium: data.product == 'premium'
    }
}

export async function logIn(): Promise<void> {
    const data = await authenticate() 

    if (data instanceof AuthError || data instanceof MismatchStateError) {
        console.error(data.message)
        return
    }

    const { expires_in, access_token, refresh_token } = data
    const user = await getProfile(access_token)

    const expires_at = Date.now() + Number(expires_in) * 1000
    const session = { ...user, access_token, refresh_token, expires_at  }
    storage.set('session', session)
}

export async function logOut(): Promise<void> {
    await storage.removeItem('session') 
}

// Show on Uninstall
export function revokeAccess() {
    const logoutUrl = 'https://www.spotify.com/account/apps'
    window.open(logoutUrl, '_blank', 'width=700,height=500')
}

export async function refreshTokens(refresh_token: string): Promise<void> {
    const client_id = process.env.PLASMO_PUBLIC_CLIENT_ID
    const { expires_in, access_token, refresh_token: refreshed_token } = await  exchangeTokens({
        client_id,
        refresh_token,
        grant_type: 'refresh_token',
    })

    const session = await storage.get('session') || {}
    const expires_at = Date.now() + Number(expires_in) * 1000
    storage.set('session', { 
        ...session,
        expires_at, 
        access_token,
        refresh_token: refreshed_token
    })
}
