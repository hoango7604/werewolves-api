import { Injectable } from '@nestjs/common';

import { Game } from '../../entities/game';
import { IPlayer } from '../../entities/player';

@Injectable()
export class PlayerService {
  constructor(private game: Game) {}

  getPlayers() {
    return this.game.getPlayers()
  }

  getAlivePlayers() {
    return this.game.getAlivePlayers()
  }

  addPlayer(player: IPlayer) {
    return this.game.addPlayer(player)
  }

  updatePlayer(id: string, updatedPlayer: Partial<IPlayer>) {
    return this.game.updatePlayer(id, updatedPlayer)
  }

  removePlayer(id: string) {
    return this.game.removePlayer(id)
  }

  selectPlayerForAction(playerId: string, id: string) {
    const players = this.game.getPlayers()
    const currentPlayer = players.find(player => player.id === playerId)
    if (currentPlayer) {
      currentPlayer.selectPlayerForAction(id)
    }
  }
}
