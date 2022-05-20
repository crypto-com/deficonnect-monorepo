
import {  NetworkConfig, IDeFiConnectProvider, JsonRpcRequestArguments } from '@deficonnect/types'
import { isDeFiConnectProvider } from '@deficonnect/utils'
import { WebSocketProvider } from '@deficonnect/websocket-provider'
import Emitter from 'events'

declare global {
  interface Window {
    ethereum?: any
    deficonnectProvider?: any
  }
}


export class DeFiConnectProvider extends Emitter implements IDeFiConnectProvider {
  networkConfig: NetworkConfig
  isDeficonnectProvider = true
  deficonnectProvider?: IDeFiConnectProvider

  constructor(network: NetworkConfig) {
    super()
    this.networkConfig = network
  }

  setupProviderEvent() {
    this.deficonnectProvider?.on('chainChanged', (args) => {
      this.emit('chainChanged', args)
    })
    this.deficonnectProvider?.on('accountsChanged', (args) => {
      this.emit('accountsChanged', args)
    })
    this.deficonnectProvider?.on('disconnect', (args) => {
      this.emit('disconnect', args)
    })
  }
  async getProvider(): Promise<IDeFiConnectProvider> {
    async function checkIsReady(times = 0) {
      return new Promise((resolve) => {
        function check() {
          if(isDeFiConnectProvider(window.deficonnectProvider)) {
            resolve(true)
            return
          } 
          if (times > 0 ) {
            setTimeout(async () => {
              --times
              check()
            }, 100)
            return
          }
          resolve(false)
        }
        check()
      })
    }
    if(!this.deficonnectProvider) {
      await checkIsReady(10)
      if(isDeFiConnectProvider(window.deficonnectProvider)) {
        this.deficonnectProvider = window.deficonnectProvider
        this.setupProviderEvent()
      }
    }
    
    if(this.deficonnectProvider) {
      return this.deficonnectProvider
    } else {
      const provider = new WebSocketProvider(this.networkConfig)
      this.deficonnectProvider = provider
      this.setupProviderEvent()
      return provider
    }
  }
  get chainId() {
    return '0x' + Number(this.networkVersion).toString(16)
  }
  get networkVersion() {
    return this.deficonnectProvider?.networkVersion ?? '1'
  }
  get accounts() {
    return this.deficonnectProvider?.accounts ?? []
  }

  async connectEagerly(network?: NetworkConfig): Promise<string[]> {
    if(network) {
      this.networkConfig = network
    }
    const provider = await this.getProvider()
    return provider.connectEagerly(this.networkConfig)
  }

  async connect(network?: NetworkConfig): Promise<string[]> {
    if(network) {
      this.networkConfig = network
    }
    const provider = await this.getProvider()
    return provider.connect(this.networkConfig)
  }

  async enable(network?: NetworkConfig): Promise<string[]> {
    if(network) {
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

