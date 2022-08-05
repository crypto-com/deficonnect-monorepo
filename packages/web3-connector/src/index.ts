import { DeFiConnectProvider } from '@deficonnect/provider'
import { NetworkConfig, RpcUrlConfig } from '@deficonnect/types'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { AbstractConnectorArguments, ConnectorUpdate } from '@web3-react/types'
import warning from 'tiny-warning'

// import { Send, SendOld, SendReturn, SendReturnResult } from './types'
declare global {
  interface Window {
    deficonnectProvider?: any
  }
}

function parseSendReturn(sendReturn: any): any {
  return sendReturn.hasOwnProperty('result') ? sendReturn.result : sendReturn
}

export class NoEthereumProviderError extends Error {
  public constructor() {
    super()
    this.name = this.constructor.name
    this.message = 'No Ethereum provider was found on this.provider.'
  }
}

export class UserRejectedRequestError extends Error {
  public constructor() {
    super()
    this.name = this.constructor.name
    this.message = 'The user rejected the request.'
  }
}

export interface DeFiConnectorArguments extends AbstractConnectorArguments {
  appName: string
  chainType: string
  chainId: string
  rpcUrls: RpcUrlConfig
}

export class DeFiWeb3Connector extends AbstractConnector {
  provider: DeFiConnectProvider
  constructor(args: DeFiConnectorArguments) {
    const { supportedChainIds, ...networkConfig } = args
    super({ supportedChainIds } as AbstractConnector)
    this.provider = new DeFiConnectProvider(networkConfig as NetworkConfig)
    this.handleNetworkChanged = this.handleNetworkChanged.bind(this)
    this.handleChainChanged = this.handleChainChanged.bind(this)
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this)
    this.handleClose = this.handleClose.bind(this)

    this.provider.on('chainChanged', this.handleChainChanged)
    this.provider.on('accountsChanged', this.handleAccountsChanged)
    this.provider.on('disconnect', this.handleClose)
    this.provider.on('networkChanged', this.handleNetworkChanged)
  }

  private handleChainChanged(chainId: string | number): void {
    this.emitUpdate({ chainId, provider: this.provider })
  }

  private handleAccountsChanged(accounts: string[]): void {
    if (accounts.length === 0) {
      this.emitDeactivate()
    } else {
      this.emitUpdate({ account: accounts[0] })
    }
  }

  private handleClose(): void {
    this.emitDeactivate()
  }

  private handleNetworkChanged(networkId: string | number): void {
    this.emitUpdate({ chainId: networkId, provider: this.provider })
  }

  public async activate(): Promise<ConnectorUpdate> {
    // try to activate + get account via eth_accounts
    console.log('activate window.ethereum:', window.ethereum)
    console.log('activate')
    console.error('useragent' + navigator?.userAgent)
    console.error('useragent DeFiWallet:' + navigator?.userAgent?.includes('DeFiWallet'))
    let account
    try {
      console.error('activate eth_accounts 1')
      account = await this.provider
        .request({ method: 'eth_accounts' })
        .then((sendReturn: any) => parseSendReturn(sendReturn)[0])
      // dapp browser sometimes will return a white space string, like: '   '
      console.error('activate eth_accounts result:' + account)
      account = account.trim()
      console.error('activate eth_accounts result trim:' + account)
    } catch (error) {
      if ((error as any).code === 4001) {
        throw new UserRejectedRequestError()
      }
      warning(false, 'eth_accounts was unsuccessful, falling back to enable')
    }
    // if unsuccessful, try enable
    if (!account) {
      console.error('activate eth_requestAccounts')
      // if enable is successful but doesn't return accounts, fall back to getAccount (not happy i have to do this...)
      account = await this.provider.connect().then((sendReturn: any) => sendReturn && parseSendReturn(sendReturn)[0]).catch(console.error)
      console.error('activate eth_requestAccounts result:' + account)
    }

    return { provider: this.provider, ...(account ? { account } : {}) }
  }

  public async getProvider(): Promise<any> {
    return this.provider
  }

  public async getChainId(): Promise<number | string> {
    if (!this.provider) {
      throw new NoEthereumProviderError()
    }

    let chainId
    try {
      chainId = await this.provider.request({ method: 'eth_chainId' }).then(parseSendReturn)
    } catch {
      warning(false, 'eth_chainId was unsuccessful, falling back to net_version')
    }

    if (!chainId) {
      try {
        chainId = await this.provider.request({ method: 'net_version' }).then(parseSendReturn)
      } catch {
        warning(false, 'net_version was unsuccessful, falling back to net version v2')
      }
    }

    if (!chainId) {
      chainId = this.provider.chainId
    }

    return chainId
  }

  public async getAccount(): Promise<null | string> {
    if (!this.provider) {
      throw new NoEthereumProviderError()
    }

    let account
    try {
      account = await this.provider
        .request({ method: 'eth_accounts' })
        .then((sendReturn: any) => parseSendReturn(sendReturn)[0])
    } catch {
      warning(false, 'eth_accounts was unsuccessful, falling back to enable')
    }

    if (!account) {
      try {
        account = await this.provider.enable().then((sendReturn: any) => parseSendReturn(sendReturn)[0])
      } catch {
        warning(false, 'enable was unsuccessful, falling back to eth_accounts v2')
      }
    }

    return account
  }

  public close() {
    this.deactivate()
  }

  public deactivate() {
    this.provider.close()
  }
}
