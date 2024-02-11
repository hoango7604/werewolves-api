import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';

import { Player } from '../../entities/player';
import { CreatePlayerDto } from '../game/validators';
import { PlayerService } from './player.service';

@Controller('players')
export class PlayerController {
  constructor(private playerService: PlayerService) {}

  @Get()
  getPlayers(@Query('status') status: string) {
    if (status && status.toLowerCase() === 'alive') {
      return this.playerService.getAlivePlayers()
    }
    return this.playerService.getPlayers()
  }

  @Post('/:id/vote')
  selectPlayerForAction(@Param('id') playerId: string, @Body('id') id: string) {
    return this.playerService.selectPlayerForAction(playerId, id)
  }

  @Post()
  addPlayer(@Body() data: CreatePlayerDto) {
    const player = new Player(data.name, data.imgUrl)
    return this.playerService.addPlayer(player)
  }

  @Patch('/:id')
  updatePlayer(@Param('id') id: string, @Body() updatedPlayer: Partial<Player>) {
    return this.playerService.updatePlayer(id, updatedPlayer)
  }

  @Delete('/:id')
  removePlayer(@Param('id') id: string) {
    return this.playerService.removePlayer(id)
  }

}
