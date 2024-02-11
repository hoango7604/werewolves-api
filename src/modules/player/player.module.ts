import { Module } from '@nestjs/common';

import { GameModule } from '../game/game.module';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';

@Module({
  controllers: [PlayerController],
  providers: [PlayerService],
  imports: [GameModule],
})
export class PlayerModule {}
