export interface Session {
    user_name: string,
    expires_at: number
    is_premium: boolean,
    access_token: string,
    refresh_token: string,
}
