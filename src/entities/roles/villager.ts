import { IGame } from '../game'
import { Roles, RolesConfig } from '../../constants/role'
import { BaseRole, IRole } from './role'

export class Villager extends BaseRole implements IRole {
  static roleName = 'Villager'
  static priority = 100
  static imgUrl = ''

  constructor() {
    super(RolesConfig[Roles.Villager])
  }

  public callWakeUp(): void {
    // VILLAGER DON'T WAKE UP
  }

  public callSleep(): void {
    // VILLAGER DON'T GO TO SLEEP
  }

  public async action(game: IGame): Promise<void> {
    // VILLAGER DO NOTHING
  }
}
