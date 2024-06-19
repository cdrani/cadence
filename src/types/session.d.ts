export interface Profile {
    user_name: string,
    is_premium: boolean,
}

export interface Session extends Profile {
    expires_at: number
    access_token: string,
    refresh_token: string,
}
