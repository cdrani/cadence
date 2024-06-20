import { Storage } from "@plasmohq/storage"

import type { Session } from "~types/session"
import { refreshTokens } from "~services/auth"

const storage = new Storage({ area: 'local' })

chrome.runtime.onConnect.addListener(async () => {
    const session = await storage.get('session') as Session

    if (!session?.expires_at) return
    if (session.expires_at >= Date.now()) return 

    await refreshTokens(session.refresh_token)
})
