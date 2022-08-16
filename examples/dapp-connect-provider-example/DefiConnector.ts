import { DeFiConnectProvider } from '@deficonnect/provider'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { AbstractConnectorArguments, ConnectorUpdate } from '@web3-react/types'
import { NETWORK_URLS } from 'connectors'

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

export class DeFiConnector extends AbstractConnector {
  provider: DeFiConnectProvider
  constructor(args: AbstractConnectorArguments) {
    super(args)
    this.provider = new DeFiConnectProvider({
      appName: 'Uniswap',
      chainType: 'eth',
      chainId: '1',
      rpcUrls: NETWORK_URLS,
    })
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
    // if enable is successful but doesn't return accounts, fall back to getAccount (not happy i have to do this...)
    const account = await this.provider.connect().then((sendReturn: any) => sendReturn && parseSendReturn(sendReturn)[0])

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
      console.warn(false, 'eth_chainId was unsuccessful, falling back to net_version')
    }

    if (!chainId) {
      try {
        chainId = await this.provider.request({ method: 'net_version' }).then(parseSendReturn)
      } catch {
        console.warn(false, 'net_version was unsuccessful, falling back to net version v2')
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
      console.warn(false, 'eth_accounts was unsuccessful, falling back to enable')
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