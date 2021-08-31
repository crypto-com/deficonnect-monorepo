import { ISessionStorage, IWalletConnectSession } from '@deficonnect/types'
import { isWalletConnectSession, getLocal, setLocal, removeLocal } from '@deficonnect/utils'

const defaultKey = 'DeFiLink_session_storage_dapp'

export class SessionStorage implements ISessionStorage {
  key: string
  constructor({ key } = { key: defaultKey }) {
    this.key = key
  }

  getSession = (): IWalletConnectSession | null => {
    const session = getLocal(this.key)
    if (session && isWalletConnectSession(session) && session.accounts && session.accounts.length > 0) {
      return session
    }
    return null
  }

  setSession = (session: IWalletConnectSession): IWalletConnectSession => {
    setLocal(this.key, session)
    return session
  }

  removeSession = () => {
    removeLocal(this.key)
  }
}
