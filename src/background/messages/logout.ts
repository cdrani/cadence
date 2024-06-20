import type { PlasmoMessaging } from "@plasmohq/messaging"

import { logOut } from "~services/auth"

const handler: PlasmoMessaging.MessageHandler = async () => {
    await logOut()
}

export default handler
