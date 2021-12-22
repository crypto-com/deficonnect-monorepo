import Connector from '@deficonnect/core'
import { IWalletConnectOptions, ISessionStorage, IConnector } from '@deficonnect/types'
import * as cryptoLib from '@deficonnect/iso-crypto'
import SocketTransport from '@deficonnect/socket-transport'
import { parseWalletConnectUri } from '@deficonnect/utils'
import { ITransportLib } from '@deficonnect/types'

interface DeFiExistsConnectorClientParams {
  connector: IConnector
  transport: DeFiTransportLib
}
export interface DeFiConnectorClientParams {
  connectorOpts?: IWalletConnectOptions
  sessionStorage?: ISessionStorage
  exists?: DeFiExistsConnectorClientParams
}

export interface DeFiTransportLib extends ITransportLib {
  connected: boolean
}

export class DeFiConnectorClient {
  connector: IConnector
  transport: DeFiTransportLib
  sessionStorage?: ISessionStorage
  constructor(params: DeFiConnectorClientParams) {
    const { connectorOpts, sessionStorage, exists } = params
    this.sessionStorage = sessionStorage
    const session = connectorOpts?.session || sessionStorage?.getSession()
    let bridge = connectorOpts?.bridge ?? session?.bridge
    if (!bridge && connectorOpts?.uri) {
      bridge = parseWalletConnectUri(connectorOpts.uri).bridge
    }
    let transport: DeFiTransportLib | undefined
    if (!!exists) {
      transport = exists.transport
    } else if (!!bridge) {
      transport = new SocketTransport({
        protocol: 'wc',
        version: 3,
        url: bridge,
      })
    }
    if (!transport) {
      throw new Error('bridge can not be null')
    }
    let connector: IConnector | undefined
    if (!!exists) {
      connector = exists.connector
    } else if (!!connectorOpts) {
      connector = new Connector({
        cryptoLib,
        connectorOpts,
        sessionStorage,
        transport: transport,
      })
    }
    if (!connector) {
      throw new Error('connectorOpts can not be null')
    }
    this.connector = connector
    this.transport = transport
    this.transport.subscribe(connector.clientId)
  }

  clearSessionStorage() {
    if (this.sessionStorage) {
      this.sessionStorage.removeSession()
    } else {
      const connector = this.connector as any
      connector._sessionStorage?.removeSession()
    }
  }
}
