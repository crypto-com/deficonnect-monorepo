import 'regenerator-runtime/runtime'
import { DeFiWeb3Connector, DeFiWeb3ConnectorArguments } from './lib/connector/DeFiWeb3Connector'
import { DeFiConnector, DeFiConnectorArguments } from './lib/connector/DeFiConnector'
import { SessionStorage } from './lib/SessionStorage'
import { InstallExtensionModal } from './lib/InstallExtensionModal'
import { formatToCWEURI, formatToWCURI, addUrlParams, formatUriAddUrlParams, removeAllUrlParams } from './lib/tools'
import SocketTransport from '@deficonnect/socket-transport'
import { DeFiConnectorClient } from './lib/DeFiConnectorClient'

export {
  DeFiConnector,
  DeFiWeb3Connector,
  SessionStorage,
  InstallExtensionModal,
  formatToCWEURI,
  formatToWCURI,
  addUrlParams,
  formatUriAddUrlParams,
  removeAllUrlParams,
  SocketTransport,
  DeFiConnectorClient,
}

export type { DeFiConnectorArguments, DeFiWeb3ConnectorArguments }
