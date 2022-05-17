declare module "@deficonnect/types" {
  export interface IConnector {
    bridge: string;
    key: string;
    clientId: string;
    peerId: string;
    readonly clientMeta: IClientMeta | null;
    peerMeta: IClientMeta | null;
    handshakeTopic: string;
    handshakeId: number;
    uri: string;
    chainId: string;
    chainType:string;
    accounts: string[];
    rpcUrl: string;
    readonly connected: boolean;
    readonly pending: boolean;
    session: IWalletConnectSession;

    on(event: string, callback: (error: IJsonRpcErrorMessage | null, payload: any | null) => void): void;
    connect(opts?: ICreateSessionOptions): Promise<ISessionStatus>;
    createSession(opts?: ICreateSessionOptions): Promise<void>;
    approveSession(sessionStatus: ISessionStatus): void;
    rejectSession(sessionError?: ISessionError): void;
    updateSession(sessionStatus: ISessionStatus): void;
    killSession(sessionError?: ISessionError): Promise<void>;

    sendTransaction(tx: ITxData): Promise<any>;
    signTransaction(tx: ITxData): Promise<any>;
    signMessage(params: any[]): Promise<any>;
    signPersonalMessage(params: any[]): Promise<any>;
    signTypedData(params: any[]): Promise<any>;
    updateChain(chainParams: IUpdateChainParams): Promise<any>;

    sendCustomRequest(request: Partial<IJsonRpcRequest>, options?: IRequestOptions): Promise<any>;
    unsafeSend(
      request: IJsonRpcRequest,
      options?: IRequestOptions,
    ): Promise<IJsonRpcResponseSuccess | IJsonRpcResponseError>;
    sendJSONRequest(jsonRequest: {
      method: string;
      params: any[];
      session: IJsonRpcRequestSessionInfo;
    }, options?: IRequestOptions): Promise<any>;

    approveRequest(response: Partial<IJsonRpcResponseSuccess>): void;
    rejectRequest(response: Partial<IJsonRpcResponseError>): void;
  }

  export interface ICryptoLib {
    generateKey: (length?: number) => Promise<ArrayBuffer>;
    encrypt: (
      data: IJsonRpcRequest | IJsonRpcResponseSuccess | IJsonRpcResponseError,
      key: ArrayBuffer,
      iv?: ArrayBuffer,
    ) => Promise<IEncryptionPayload>;
    decrypt: (
      payload: IEncryptionPayload,
      key: ArrayBuffer,
    ) => Promise<IJsonRpcRequest | IJsonRpcResponseSuccess | IJsonRpcResponseError | null>;
  }

  export interface ITransportLib {
    open: () => void;
    close: () => void;
    send: (message: string, topic?: string, silent?: boolean) => void;
    subscribe: (topic: string) => void;
    on: (event: string, callback: (payload: any) => void) => void;
  }

  export interface ITransportEvent {
    event: string;
    callback: (payload: any) => void;
  }

  export type NetworkEvent = "online" | "offline";

  export interface INetworkMonitor {
    on: (event: NetworkEvent, callback: () => void) => void;
  }

  export interface INetworkEventEmitter {
    event: NetworkEvent;
    callback: () => void;
  }

  export interface ISessionStorage {
    getSession: () => IWalletConnectSession | null;
    setSession: (session: IWalletConnectSession) => IWalletConnectSession;
    removeSession: () => void;
  }

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

  export interface ISocketTransportOptions {
    protocol: string;
    version: number;
    url: string;
    netMonitor?: INetworkMonitor;
    subscriptions?: string[];
  }

  export interface ISessionStatus {
    chainType: string;
    chainId: string;
    accounts: string[];
    rpcUrl?: string;
    selectedWalletId: string;
    wallets: IWalletConnectSessionWallet[];
  }

  export interface ISessionError {
    message?: string;
  }

  export interface IInternalEvent {
    event: string;
    params: any;
  }

  export interface ICallTxData {
    type?: string;
    to?: string;
    value?: number | string;
    gas?: number | string;
    gasLimit?: number | string;
    gasPrice?: number | string;
    nonce?: number | string;
    data?: string;
  }

  export interface ITxData extends ICallTxData {
    from: string;
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

  export interface IJsonRpcSubscription {
    id: number;
    jsonrpc: string;
    method: string;
    params: any;
  }

  export type JsonRpc =
    | IJsonRpcRequest
    | IJsonRpcSubscription
    | IJsonRpcResponseSuccess
    | IJsonRpcResponseError;

  export type IErrorCallback = (err: Error | null, data?: any) => void;

  export type ICallback = () => void;

  export interface IError extends Error {
    res?: any;
    code?: any;
  }

  export interface IClientMeta {
    description: string;
    url: string;
    icons: string[];
    name: string;
  }

  export interface IEventEmitter {
    event: string;
    callback: (error: IJsonRpcErrorMessage | null, request: any | null) => void;
  }

  export interface IRequiredParamsResult {
    handshakeTopic: string;
    version: number;
  }

  export interface IQueryParamsResult {
    bridge: string;
    key: string;
  }

  export interface IParseURIResult {
    protocol: string;
    handshakeTopic: string;
    version: number;
    bridge: string;
    key: string;
  }

  export interface ISessionParams {
    approved: boolean;
    chainId: string | null;
    chainType: string | null;
    accounts: string[] | null;
    rpcUrl?: string | null;
    peerId?: string | null;
    peerMeta?: IClientMeta | null;
    selectedWalletId: string | null;
    wallets: IWalletConnectSessionWallet[];
  }


  export interface IWalletConnectSessionWalletAdress {
    address: string
    algo?: string ////"secp256k1" | "ed25519" | "sr25519"
    pubkey?: string
  }
  export interface IWalletConnectSessionWalletAdresses {
    [addressType: string]: IWalletConnectSessionWalletAdress
  }
  export interface IWalletConnectSessionWallet {
    id: string;
    name: string;
    icon: string;
    addresses: IWalletConnectSessionWalletAdresses;
  }
  export interface IWalletConnectSession {
    connected: boolean;
    accounts: string[];
    chainType: string;
    chainId: string;
    bridge: string;
    key: string;
    clientId: string;
    clientMeta: IClientMeta | null;
    peerId: string;
    peerMeta: IClientMeta | null;
    handshakeId: number;
    handshakeTopic: string;
    selectedWalletId: string;
    wallets: IWalletConnectSessionWallet[];
  }

  export interface IWalletConnectOptions {
    bridge?: string;
    uri?: string;
    storageId?: string;
    signingMethods?: string[];
    session?: IWalletConnectSession;
    storage?: ISessionStorage;
    clientMeta?: IClientMeta;
    qrcodeModal?: IQRCodeModal;
    qrcodeModalOptions?: IQRCodeModalOptions;
  }

  export interface IConnectorOpts {
    cryptoLib: ICryptoLib;
    connectorOpts: IWalletConnectOptions;
    transport?: ITransportLib;
    sessionStorage?: ISessionStorage;
    pushServerOpts?: IPushServerOptions;
  }

  export interface INodeJSOptions {
    clientMeta: IClientMeta;
  }

  export interface IPushServerOptions {
    url: string;
    type: string;
    token: string;
    peerMeta?: boolean;
    language?: string;
  }

  export interface INativeWalletOptions {
    clientMeta: IClientMeta;
    push?: IPushServerOptions | null;
  }

  export interface IPushSubscription {
    bridge: string;
    topic: string;
    type: string;
    token: string;
    peerName: string;
    language: string;
  }

  export interface IUpdateChainParams {
    chainType: string;
    chainId: string;
    rpcUrl: string;
    nativeCurrency: {
      name: string;
      symbol: string;
    };
  }

  export interface IRPCMap {
    [chainId: string]: string;
  }

  export interface IWCRpcConnectionOptions {
    connector?: IConnector;
    bridge?: string;
    qrcode?: boolean;
    chainId?: string;
    storageId?: string;
    signingMethods?: string[];
    qrcodeModalOptions?: IQRCodeModalOptions;
    clientMeta?: IClientMeta;
  }

  export interface IWCEthRpcConnectionOptions extends IWCRpcConnectionOptions {
    rpc?: IRPCMap;
    infuraId?: string;
  }

  export interface IWalletConnectStarkwareProviderOptions extends IWCRpcConnectionOptions {
    contractAddress: string;
  }

  export interface IWalletConnectSDKOptions extends IWalletConnectOptions {
    bridge?: string;
  }

  export interface IWalletConnectProviderOptions extends IWCEthRpcConnectionOptions {
    pollingInterval?: number;
    qrcodeModal?: IQRCodeModal;
  }

  export interface IRequestOptions {
    forcePushNotification?: boolean;
  }

  export interface IInternalRequestOptions extends IRequestOptions {
    topic: string;
  }

  export interface ICreateSessionOptions {
    chainType?: string;
    chainId?: string;
    accountTypes?: string[];
  }
  export abstract class IEvents {
    public abstract on(event: string, listener: any): void;
    public abstract once(event: string, listener: any): void;
    public abstract off(event: string, listener: any): void;
    public abstract removeListener(event: string, listener: any): void;
  }

  export interface IRpcConnection extends IEvents {
    connected: boolean;

    send(payload: any): Promise<any>;
    open(): Promise<void>;
    close(): Promise<void>;
  }

  export interface IWCRpcConnection extends IRpcConnection {
    bridge: string;
    qrcode: boolean;
    qrcodeModalOptions: IQRCodeModalOptions | undefined;
    wc: IConnector;
    chainId: string;
    connected: boolean;
    connector: IConnector;

    create(chainId?: string): void;
    open(): Promise<void>;
    close(): Promise<void>;
    onOpen(): void;
    onClose(): void;
    onError(payload: any, message: string, code?: number): void;
    send(payload: any): Promise<any>;
    sendPayload(payload: any): Promise<IJsonRpcResponseSuccess | IJsonRpcResponseError>;
  }

  export interface IQRCodeModal {
    open(uri: string, cb: any, opts?: any): void;
    close(): void;
  }

  export interface IQRCodeModalOptions {
    mobileLinks?: string[];
    desktopLinks?: string[];
  }

  export interface IMobileRegistryEntry {
    name: string;
    shortName: string;
    color: string;
    logo: string;
    universalLink: string;
    deepLink: string;
  }

  export type IMobileRegistry = IMobileRegistryEntry[];

  export interface IMobileLinkInfo {
    name: string;
    href: string;
  }

  export interface IAppEntry {
    id: string;
    name: string;
    homepage: string;
    chains: string[];
    app: {
      browser: string;
      ios: string;
      android: string;
      mac: string;
      windows: string;
      linux: string;
    };
    mobile: {
      native: string;
      universal: string;
    };
    desktop: {
      native: string;
      universal: string;
    };
    metadata: {
      shortName: string;
      colors: {
        primary: string;
        secondary: string;
      };
    };
  }

  export type IAppRegistry = {
    [id: string]: IAppEntry;
  };

  export interface IRpcConfig {
    infuraId: string | undefined;
    custom: IRPCMap | undefined;
  }
}
