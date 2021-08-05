import { ISessionStorage, IWalletConnectSession } from '@walletconnect/types'
import { isWalletConnectSession, getLocal, setLocal, removeLocal } from '@walletconnect/utils'

const key = 'cc_walletconnect_session_storage'

export class SessionStorage implements ISessionStorage {
  getSession(): IWalletConnectSession | null {
    const session = getLocal(key)
    if (session && isWalletConnectSession(session) && session.accounts && session.accounts.length > 0) {
      return session
    }
    return null
  }

  setSession(session: IWalletConnectSession): IWalletConnectSession {
    setLocal(key, session)
    return session
  }

  removeSession() {
    removeLocal(key)
  }
}
