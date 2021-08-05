import Connector from '@walletconnect/core'
import { IWalletConnectOptions, ISessionStorage } from '@walletconnect/types'
import * as cryptoLib from '@walletconnect/iso-crypto'
import SocketTransport from '../socket-transport'
import { uuid, parseWalletConnectUri } from '@walletconnect/utils'

export const walletConnectorGenerator = (
  connectorOpts: IWalletConnectOptions,
  sessionStorage: ISessionStorage
): Connector => {
  const session = connectorOpts.session || sessionStorage.getSession()
  const { clientId = uuid() } = session || {}
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
  const newClientId = clientId || uuid()
  const transport = new SocketTransport({
    protocol: 'wc',
    version: 1,
    url: bridge,
    subscriptions: [newClientId],
  })
  const connector = new Connector({
    cryptoLib,
    connectorOpts,
    sessionStorage,
    transport,
  })
  if (clientId !== connector.clientId) {
    connector.clientId = clientId
  }
  return connector
}
