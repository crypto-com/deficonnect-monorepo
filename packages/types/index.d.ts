declare module "@deficonnect/types" {
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

  export interface IDeFiConnectSessionWalletAddresses {
    address: string
    algo?: string ////"secp256k1" | "ed25519" | "sr25519"
    pubkey?: string
  }
  export interface IDeFiConnectSessionWalletAddress {
    [addressType: string]: IDeFiConnectSessionWalletAddresses
  }
  export interface IDeFiConnectSessionWallet {
    id: string;
    name: string;
    icon: string;
    addresses: IDeFiConnectSessionWalletAddress;
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
    chainType: 'eth'
    chainId: string
    rpcUrls: RpcUrlConfig
    customNode?: EthCustomNodeConfig
  }


  export interface RpcUrlConfig {
    [rpcUrl: string]: string
  }

  export interface EthCustomNodeConfig {
    name: string
    rpcUrl: string
    symbol: string
    decimal: string
    explorer?: string
  }
  
  export interface CosmosNetworkConfig {
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
  
  export type NetworkConfig = EthNetworkConfig | CosmosNetworkConfig

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
  
    connectEagerly(network: NetworkConfig): Promise<string[]>
    connect(network: NetworkConfig): Promise<string[]>
    enable(): Promise<string[]>
    close(): Promise<void>

    request(args: JsonRpcRequestArguments): Promise<unknown>

    on(event: string, listener: (...args: any[]) => void): this
    once(event: string, listener: (...args: any[]) => void): this
  }
}