
export interface WsData {
  eventId: number
  events: Event[]
  socket_sequence: number
  timestamp: number
  timestampms: number
  type: string
}

export interface Event {
  delta: string
  price: string
  reason: string
  remaining: string
  side: string
  type: string
}
