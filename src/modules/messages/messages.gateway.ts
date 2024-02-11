import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WsResponse,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io'

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class MessagesGateway {
  @WebSocketServer()
  server: Server

  @SubscribeMessage('events')
  async findAll(): Promise<WsResponse<number>> {
    await Promise.resolve(this.server.emit('events', 1))
    await Promise.resolve(this.server.emit('events', 2))
    return { event: 'events', data: 3 }
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }

  @SubscribeMessage('test')
  async testHandler(): Promise<any> {
    await Promise.resolve(1)
    await Promise.resolve(2)
    return 3
  }
}
