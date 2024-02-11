import { Module } from '@nestjs/common';

import { GameModule } from '../game/game.module';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  controllers: [RoleController],
  providers: [RoleService],
  imports: [GameModule],
})
export class RoleModule {}
