import { ISessionStorage, IWalletConnectSession } from '@deficonnect/types'
import { getLocal, setLocal, removeLocal } from '@deficonnect/utils'

const defaultKey = 'DeFiLink_session_storage_dapp'

export function isWalletConnectSession(object: any): object is IWalletConnectSession {
  return (
    object &&
    typeof object.bridge !== 'undefined' &&
    typeof object.chainId !== 'undefined' &&
    typeof object.chainType !== 'undefined' &&
    typeof object.wallets !== 'undefined' &&
    typeof object.wallets !== 'undefined' &&
    typeof object.wallets[0] !== 'undefined' &&
    typeof object.wallets[0].addresses !== 'undefined' &&
    typeof object.wallets[0].addresses.eth !== 'undefined' &&
    typeof object.accounts !== 'undefined' &&
    object.accounts.length > 0
  )
}

export class SessionStorage implements ISessionStorage {
  key: string
  constructor({ key } = { key: defaultKey }) {
    this.key = key
  }

  getSession = (): IWalletConnectSession | null => {
    const session = getLocal(this.key)
    if (isWalletConnectSession(session)) {
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
