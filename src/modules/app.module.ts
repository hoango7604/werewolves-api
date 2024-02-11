import { Module } from '@nestjs/common';
import { MessagesModule } from './messages/messages.module';
import { GameModule } from './game/game.module';
import { RoleModule } from './role/role.module';
import { PlayerModule } from './player/player.module';

@Module({
  imports: [MessagesModule, GameModule, RoleModule, PlayerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
