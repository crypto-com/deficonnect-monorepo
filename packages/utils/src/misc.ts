import { v4 as uuidv4 } from 'uuid'

export function uuid(): string {
  return uuidv4()
}

export function payloadId(): number {
  const date = Date.now() * Math.pow(10, 3)
  const extra = Math.floor(Math.random() * Math.pow(10, 3))
  return date + extra
}

