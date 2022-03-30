import { ISessionStorage, IWalletConnectSession } from '@deficonnect/types'
import { getLocal, setLocal, removeLocal } from '@deficonnect/utils'

const defaultKey = 'DeFiLink_session_storage_dapp'

function isWalletConnectSession(object: any): object is IWalletConnectSession {
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

interface DefaultSessionStorageParams {
  key?: string
  supportedChainIds: string[]
}

export class DefaultSessionStorage implements ISessionStorage {
  key: string
  supportedChainIds: string[]
  constructor({ key = defaultKey, supportedChainIds }: DefaultSessionStorageParams) {
    this.key = key
    this.supportedChainIds = supportedChainIds
  }

  getSession = (): IWalletConnectSession | null => {
    const session = getLocal(this.key)
    if (isWalletConnectSession(session) && this.supportedChainIds.includes(session.chainId)) {
      return session
    }
    return null
  }

  setSession = (session: IWalletConnectSession): IWalletConnectSession => {
    if (this.supportedChainIds.includes(session.chainId)) {
      setLocal(this.key, session)
    }
    return session
  }

  removeSession = () => {
    removeLocal(this.key)
  }
}
