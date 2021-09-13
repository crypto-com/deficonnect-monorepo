import Connector from '@deficonnect/core'
import { IWalletConnectOptions, ISessionStorage } from '@deficonnect/types'
import * as cryptoLib from '@deficonnect/iso-crypto'
import SocketTransport from '@deficonnect/socket-transport'
import { parseWalletConnectUri } from '@deficonnect/utils'

export const DeFiLinkConnectorGenerator = (
  connectorOpts: IWalletConnectOptions,
  sessionStorage: ISessionStorage
): { connector: Connector; transport: SocketTransport } => {
  const session = connectorOpts.session || sessionStorage.getSession()
  let bridge = connectorOpts.bridge
  if (!bridge && session && session.bridge) {
    bridge = session.bridge
  }
  if (!bridge && connectorOpts.uri) {
    bridge = parseWalletConnectUri(connectorOpts.uri).bridge
  }
  if (!bridge) {
    throw new Error('bridge can not be null')
  }
  const transport = new SocketTransport({
    protocol: 'wc',
    version: 1,
    url: bridge,
  })
  const connector = new Connector({
    cryptoLib,
    connectorOpts,
    sessionStorage,
    transport,
  })
  transport.subscribe(connector.clientId)
  return { connector, transport }
}
