declare module "@deficonnect/types" {
  export interface IMobileRegistryEntry {
    name: string;
    shortName: string;
    color: string;
    logo: string;
    universalLink: string;
    deepLink: string;
  }
  export type IMobileRegistry = IMobileRegistryEntry[];
  export interface IParseURIResult {
    protocol: string;
    handshakeTopic: string;
    version: number;
    bridge: string;
    key: string;
  }

  export interface IMobileLinkInfo {
    name: string;
    href: string;
  }
  
  export interface IRequiredParamsResult {
    handshakeTopic: string;
    version: number;
  }

  export interface IQueryParamsResult {
    bridge: string;
    key: string;
  }

  export interface WSMessage {
    type: 'pub' | 'sub' | 'ack'
    payload: string
    silent: boolean
    topic: string
    rpc_id?: number
    rpc_method?: string
    from?: 'dapp' | 'extension' | 'mobile'
    name?: string
    origin?: string
  }

  export interface IClientMeta {
    description: string;
    url: string;
    icons: string[];
    name: string;
  }

  export interface IDeFiConnectSessionAddress {
    address: string
    algo?: string ////"secp256k1" | "ed25519" | "sr25519"
    pubkey?: string
  }
  export interface IDeFiConnectSessionAddresses {
    [addressType: string]: IDeFiConnectSessionAddress
  }
  export interface IDeFiConnectSessionWallet {
    id: string;
    name: string;
    icon: string;
    addresses: IDeFiConnectSessionAddresses;
  }

  export interface IDeFiConnectSession {
    connected: boolean
    accounts: string[]
    chainId: string
    chainType: string
    bridge: string
    key: string
    clientId: string
    clientMeta: IClientMeta | null
    peerId: string
    peerMeta: IClientMeta | null
    handshakeId: number
    handshakeTopic: string
    selectedWalletId: string;
    wallets: IDeFiConnectSessionWallet[];
  }

  export interface IJsonRpcResponseSuccess {
    id: number;
    jsonrpc: string;
    result: any;
  }

  export interface IJsonRpcErrorMessage {
    code?: number;
    message: string;
  }

  export interface IJsonRpcResponseError {
    id: number;
    jsonrpc: string;
    error: IJsonRpcErrorMessage;
  }

  export interface IJsonRpcRequestSessionInfo {
    chainId: string;
    chainType: string;
    account: string;
  }

  export interface IJsonRpcRequest {
    id: number;
    jsonrpc: string;
    method: string;
    params: any[];
    session?: IJsonRpcRequestSessionInfo
  }

  export type IJsonRpcMessage = IJsonRpcResponse | IJsonRpcRequest

  export type IJsonRpcResponse = IJsonRpcResponseSuccess | IJsonRpcResponseError

  export interface IEncryptionPayload {
    data: string;
    hmac: string;
    iv: string;
  }

  export interface ISocketMessage {
    topic: string;
    type: string;
    payload: string;
    silent: boolean;
  }

  export interface EthNetworkConfig {
    appName: string
    chainType: 'eth'
    chainId: string
    rpcUrls: RpcUrlConfig
    customNode?: EthCustomNodeConfig
  }


  export interface RpcUrlConfig {
    [chainId: string]: string
  }

  export interface EthCustomNodeConfig {
    name: string
    rpcUrl: string
    symbol: string
    decimal: string
    explorer?: string
  }
  
  export interface CosmosNetworkConfig {
    appName: string
    chainType: 'cosmos'
    chainId: string
    rpcUrls: RpcUrlConfig
    customNode?: CosmosCustomNodeConfig
  }

  export interface CosmosCustomNodeConfig {
    rpcUrl: string
    symbol: string
    explorer?: string
  
    denom: string
    bip44: {
      coinType: number
    }
  }
  export interface AptosNetworkConfig {
    appName: string    
    chainType: 'aptos'
    chainId: string
    rpcUrls: RpcUrlConfig
    customNode?: EthCustomNodeConfig
  }
  
  export type NetworkConfig = EthNetworkConfig | CosmosNetworkConfig | AptosNetworkConfig

  interface JsonRpcRequestArguments {
    readonly method: string
    readonly params?: readonly unknown[] | object
  }


  /**
   * EIP-1193 compatible
   */
  interface IDeFiConnectProvider {
    /**
     * hexString format. e.g: '0x1' 
     */
    get chainId(): string
    /**
     * decimal format. e.g: '1' 
     */
    get networkVersion(): string
    get accounts(): string[]
    /**
     * current suppory 'eth' and 'csomos'
     */
    get chainType(): string
  
    connectEagerly(network?: NetworkConfig): Promise<string[]>
    connect(network?: NetworkConfig): Promise<string[]>
    enable(network?: NetworkConfig): Promise<string[]>
    close(): Promise<void>

    request(args: JsonRpcRequestArguments): Promise<unknown>

    on(event: string, listener: (...args: any[]) => void): this
    removeListener(event: string, listener: (...args: any[]) => void): this
  }
}