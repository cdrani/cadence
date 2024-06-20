import { Storage } from '@plasmohq/storage'
import { useStorage } from '@plasmohq/storage/hook'
import { sendToBackground } from '@plasmohq/messaging'

import type { Session } from '~types/session'

import './style.css'

function IndexPopup() {
    const [session] = useStorage<Session | null>({
        key: 'session',
        instance:  new Storage({ area: 'local' })
    })

    async function logIn() {
        await sendToBackground({ name: 'login' })
    }

    async function logOut() {
        await sendToBackground({ name: 'logout' })
    }

    return (
        <div className="main">
            <h1>Cadence</h1>

            {session?.user_name && <h2>User: {session.user_name}</h2>}

            {session == null ? 
                <button onClick={logIn}>Log in</button>
                : <button onClick={logOut}>Log out</button>
            }
        </div>
    )
}

export default IndexPopup
