import { IGame } from '../game'
import { IPlayer } from '../player'
import { IRoleConfig, Roles } from '../../constants/role'

export interface IRole {
  id: Roles
  roleName: string
  priority: number
  imgUrl: string
  isWerewolf: boolean
  players: IPlayer[]
  callWakeUp(): void
  callSleep(): void
  action(game: IGame): Promise<void>
}

export abstract class BaseRole implements IRole {
  id: Roles
  roleName: string
  priority: number
  imgUrl: string
  isWerewolf: boolean
  players: IPlayer[]

  constructor({
    id,
    roleName,
    priority,
    imgUrl = '',
    isWerewolf = false,
  }: IRoleConfig) {
    this.id = id
    this.roleName = roleName
    this.priority = priority
    this.imgUrl = imgUrl
    this.isWerewolf = isWerewolf
    this.players = []
  }

  public callWakeUp(): void {
    console.log(`${this.roleName} turn, wake up ${this.roleName}!`)
  }

  public callSleep(): void {
    console.log(`End ${this.roleName} turn, go to sleep ${this.roleName}!`)
  }

  public abstract action(game: IGame): Promise<void>
}
