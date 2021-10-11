import Connector from '@deficonnect/core'
import { IWalletConnectOptions, ISessionStorage } from '@deficonnect/types'
import * as cryptoLib from '@deficonnect/iso-crypto'
import SocketTransport from '@deficonnect/socket-transport'
import { parseWalletConnectUri } from '@deficonnect/utils'

export class DeFiConnectorClient {
  connector: Connector
  transport: SocketTransport
  constructor(connectorOpts: IWalletConnectOptions, sessionStorage: ISessionStorage) {
    const session = connectorOpts.session || sessionStorage.getSession()
    let bridge = connectorOpts.bridge ?? session?.bridge
    if (!bridge && connectorOpts.uri) {
      bridge = parseWalletConnectUri(connectorOpts.uri).bridge
    }
    if (!bridge) {
      throw new Error('bridge can not be null')
    }
    this.transport = new SocketTransport({
      protocol: 'wc',
      version: 2,
      url: bridge,
    })
    this.connector = new Connector({
      cryptoLib,
      connectorOpts,
      sessionStorage,
      transport: this.transport,
    })
    this.transport.subscribe(this.connector.clientId)
  }
}
