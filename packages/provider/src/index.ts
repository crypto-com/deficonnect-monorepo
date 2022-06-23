
import { NetworkConfig, IDeFiConnectProvider, JsonRpcRequestArguments } from '@deficonnect/types'
import { isDeFiConnectProvider } from '@deficonnect/utils'
import { WebSocketProvider } from '@deficonnect/websocket-provider'

declare global {
  interface Window {
    ethereum?: any
    deficonnectProvider?: any
  }
}

interface EventCallback {
  event: string
  listener: (...args: any[]) => void
}
export class DeFiConnectProvider implements IDeFiConnectProvider {
  networkConfig: NetworkConfig
  isDeficonnectProvider = true
  deficonnectProvider?: IDeFiConnectProvider
  private eventCallbacks: EventCallback[] =[]

  constructor(network: NetworkConfig) {
    // super()
    this.networkConfig = network
  }

  on(event: string, listener: (...args: any[]) => void): this {
    this.eventCallbacks.push({ event, listener })
    if (this.deficonnectProvider?.on) {
      this.deficonnectProvider.on(event, listener)
    }
    return this
  }

  removeListener(event: string, listener: (...args: any[]) => void): this {
    this.eventCallbacks = this.eventCallbacks.filter(e => e.event === event && e.listener === listener)
    if (this.deficonnectProvider?.removeListener) {
      this.deficonnectProvider.removeListener(event, listener)
    }
    return this
  }

  setupProviderEvent() {
    this.eventCallbacks.forEach(e => {
      if (this.deficonnectProvider?.on) {
        this.deficonnectProvider.on(e.event, e.listener)
      }
    })
  }

  async getProvider(): Promise<IDeFiConnectProvider> {
    async function checkInjectProvider(times = 0): Promise<any> {
      return new Promise((resolve) => {
        function check() {
          if (isDeFiConnectProvider(window.deficonnectProvider)) {
            resolve(window.deficonnectProvider)
            return
          }
          if (navigator?.userAgent?.includes('DeFiWallet') && window.ethereum) {
            resolve(window.ethereum)
            return
          }
          if (times > 0) {
            setTimeout(async () => {
              --times
              check()
            }, 100)
            return
          }
          resolve(undefined)
        }
        check()
      })
    }
    if (!this.deficonnectProvider) {
      const injectProvider = await checkInjectProvider(10)
      if (injectProvider) {
        this.deficonnectProvider = injectProvider
        this.setupProviderEvent()
      }
    }

    if (this.deficonnectProvider) {
      return this.deficonnectProvider
    } else {
      const provider = new WebSocketProvider(this.networkConfig)
      this.deficonnectProvider = provider
      this.setupProviderEvent()
      return provider
    }
  }

  get chainId() {
    return this.deficonnectProvider?.chainId ?? '0x1'
  }

  get networkVersion() {
    return this.deficonnectProvider?.networkVersion ?? '1'
  }

  get accounts() {
    return this.deficonnectProvider?.accounts ?? []
  }

  get chainType(): string {
    return this.deficonnectProvider?.chainType ?? 'eth'
  }

  async connectEagerly(network?: NetworkConfig): Promise<string[]> {
    if (network) {
      this.networkConfig = network
    }
    const provider = await this.getProvider()
    return provider.connectEagerly(this.networkConfig)
  }

  async connect(network?: NetworkConfig): Promise<string[]> {
    if (network) {
      this.networkConfig = network
    }
    const provider = await this.getProvider()
    return provider.connect(this.networkConfig)
  }

  async enable(network?: NetworkConfig): Promise<string[]> {
    if (network) {
      this.networkConfig = network
    }
    const provider = await this.getProvider()
    return provider.enable(this.networkConfig)
  }

  async close(): Promise<void> {
    const provider = await this.getProvider()
    return provider.close()
  }

  get connected(): boolean {
    return this.accounts.length > 0
  }

  async request(args: JsonRpcRequestArguments): Promise<unknown> {
    const provider = await this.getProvider()
    return provider.request(args)
  }
}
