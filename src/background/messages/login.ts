import type { PlasmoMessaging } from "@plasmohq/messaging"

import { logIn } from "~services/auth"

const handler: PlasmoMessaging.MessageHandler = async () => {
    await logIn()
}

export default handler
