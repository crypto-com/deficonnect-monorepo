import 'regenerator-runtime/runtime'
import { DeFiLinkConnector, DeFiLinkConnectorArguments } from './lib/DeFiLinkConnector'
import { SessionStorage } from './lib/SessionStorage'
import { InstallExtensionModal } from './lib/InstallExtensionModal'
import { formatToCWEURI, formatToWCURI, addUrlParams, formatUriAddUrlParams, removeAllUrlParams } from './lib/tools'
import SocketTransport from '@deficonnect/socket-transport'
import { DeFiLinkConnectorGenerator } from './lib/WalletConnect'

export {
  DeFiLinkConnector,
  SessionStorage,
  InstallExtensionModal,
  formatToCWEURI,
  formatToWCURI,
  addUrlParams,
  formatUriAddUrlParams,
  removeAllUrlParams,
  SocketTransport,
  DeFiLinkConnectorGenerator,
}

export type { DeFiLinkConnectorArguments }
