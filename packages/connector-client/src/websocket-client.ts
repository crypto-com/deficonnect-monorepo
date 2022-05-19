import { addUrlParams, safeJsonParse } from '@deficonnect/utils'
import { WSMessage } from '@deficonnect/types'
import Emitter from 'events'
import { DEFI_CONNECT_URL, DEFI_CONNECT_PROTOCOL, DEFI_CONNECT_VERSION } from '.'

const WS = globalThis.WebSocket

export class WebSocketClient extends Emitter {
  private url: string
  private socket: WebSocket | null
  private nextSocket: WebSocket | null
  private queue: WSMessage[] = []
  private subscriptions: Map<string, string>

  constructor(deviceUUID: string) {
    super()
    this.url = addUrlParams(DEFI_CONNECT_URL, {
      role: 'extension',
      device_uuid: deviceUUID,
      protocol: DEFI_CONNECT_PROTOCOL,
      version: DEFI_CONNECT_VERSION,
      env: 'browser',
      host: window?.location.host || '',
    })
    this.socket = null
    this.nextSocket = null
    this.subscriptions = new Map<string, string>()

    if (typeof window !== 'undefined' && typeof (window as any).addEventListener !== 'undefined') {
      window.addEventListener('online', () => {
        this.socketCreate()
      })
    }
  }

  set readyState(_value) {
    // empty
  }

  get readyState(): number {
    return this.socket ? this.socket.readyState : -1
  }

  set connecting(_value) {
    // empty
  }

  get connecting(): boolean {
    return this.readyState === 0
  }

  set connected(_value) {
    // empty
  }

  get connected(): boolean {
    return this.readyState === 1
  }

  set closing(_value) {
    // empty
  }

  get closing(): boolean {
    return this.readyState === 2
  }

  set closed(_value) {
    // empty
  }

  get closed(): boolean {
    return this.readyState === 3
  }

  // -- public ---------------------------------------------------------- //

  public open() {
    this.socketCreate()
  }

  public close() {
    this.socketClose()
  }

  public send(msg: WSMessage) {
    this.socketSend(msg)
  }

  public subscribe(topic: string) {
    this.socketSend({
      topic: topic,
      type: 'sub',
      payload: '',
      silent: true,
    })
  }

  // -- private ---------------------------------------------------------- //

  private socketCreate() {
    if (this.nextSocket) {
      return
    }

    this.nextSocket = new WS(this.url)

    if (!this.nextSocket) {
      throw new Error('Failed to create socket')
    }

    this.nextSocket.onmessage = (event: MessageEvent) =>
      this.socketReceive(event)

    this.nextSocket.onopen = () => this.socketOpen()

    this.nextSocket.onerror = (event: Event) => this.socketError(event)

    this.nextSocket.onclose = () => {
      setTimeout(() => {
        this.nextSocket?.close()
        this.nextSocket = null
        this.socketCreate()
      }, 10000)
    }
  }

  private socketOpen() {
    this.socketClose()
    this.socket = this.nextSocket
    this.nextSocket = null
    this.resendSubscriptions()
    this.pushQueue()
  }

  private socketClose() {
    if (this.socket) {
      this.socket.onclose = () => {
        // empty
      }
      this.socket.close()
    }
  }

  private socketSend(socketMessage: WSMessage) {
    const message: string = JSON.stringify(socketMessage)
    if (socketMessage.type === 'sub') {
      this.subscriptions.set(socketMessage.topic, socketMessage.type)
    }

    if (this.socket && this.socket.readyState === 1) {
      this.socket.send(message)
    } else {
      this.setToQueue(socketMessage)
      this.socketCreate()
    }
  }

  private async socketReceive(event: MessageEvent) {
    const socketMessage: WSMessage | null = safeJsonParse(event.data)
    if (!socketMessage) {
      return
    }

    if (this.socket && this.socket.readyState === 1) {
      this.emit('message', socketMessage)
    }
  }

  private socketError(e: Event) {
    this.emit('error', e)
  }

  private resendSubscriptions() {
    this.subscriptions.forEach((_, topic: string) =>
      this.queue.push({
        topic: topic,
        type: 'sub',
        payload: '',
        silent: true,
      }),
    )
  }

  private setToQueue(socketMessage: WSMessage) {
    if (socketMessage.type === 'sub') {
      return
    }
    this.queue.push(socketMessage)
  }

  private pushQueue() {
    const queue = this.queue
    while (queue.length > 0) {
      const socketMessage = queue.shift()
      if (socketMessage) {
        this.socketSend(socketMessage)
      }
    }
  }
}
