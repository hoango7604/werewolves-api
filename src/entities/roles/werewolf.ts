import { IGame } from '../game';
import { IPlayer } from '../player';
import { Roles, RolesConfig } from '../../constants/role';
import { BaseRole, IRole } from './role'

export class Werewolf extends BaseRole implements IRole {
  constructor() {
    super(RolesConfig[Roles.Werewolf])
  }

  public async action(game: IGame): Promise<void> {
    const playersToVote = game.getAlivePlayers()
    const playersToDisplay = playersToVote.map(player => ({
      id: player.id,
      name: player.name
    }))
    console.table(playersToDisplay)
    let isValid = false
    let playerToKill: IPlayer = undefined
    while (!isValid) {
      const votedPlayers: IPlayer[] = []
      console.log('Please choose 1 person to kill (select by index, -1 for not choosing)')
      await Promise.all(this.players.map(async (player, idx) => {
        const votedPlayer = await player.handlePlayerSelection(`Wolf #${idx + 1} selection: `, playersToVote)
        votedPlayers.push(votedPlayer)
      }))
      playerToKill = votedPlayers[0]
      isValid = votedPlayers.every(player => player === playerToKill)
    }
    game.updateGameLog({
      werewolfVotedPlayer: playerToKill
    })
  }
}
