import { Injectable } from '@nestjs/common'

import { shuffle } from '../utils'
import { IPlayer } from './player'
import { Roles } from '../constants/role'
import { IRole } from './roles/role'
import { RolesById } from './roles/roleList'

export interface IPlayerReady extends IPlayer {
  isReady: boolean
}

export interface IRoleWithNumber {
  role: IRole
  number: number
}

export interface IRolesById {
  [id: string]: IRoleWithNumber
}

export interface IGame {
  getPlayers(): IPlayer[]
  getAlivePlayers(): IPlayer[]
  togglePlayerReady(id: string): IPlayerReady[]
  updateGameLog(log: Partial<GameLog>): void
  addPlayer(player: IPlayer): IPlayer
  updatePlayer(id: string, updatedPlayer: Partial<IPlayer>): IPlayer
  removePlayer(id: string): number
  addRole(id: Roles): IRoleWithNumber
  removeRole(id: Roles): IRoleWithNumber
  start(): void
}

export interface GameLog {
  werewolfVotedPlayer: IPlayer | null
  villagerVotedPlayer: IPlayer | null
  approvedCount: number,
  rejectedCount: number,
  neutralCount: number,
  hangedPlayer: IPlayer | null
  killedPlayers: IPlayer[]
}

const buildGameLog = (): GameLog => ({
  werewolfVotedPlayer: null,
  villagerVotedPlayer: null,
  approvedCount: 0,
  rejectedCount: 0,
  neutralCount: 0,
  hangedPlayer: null,
  killedPlayers: []
})

@Injectable()
export class Game implements IGame {
  private isRunning: boolean
  private players: IPlayer[]
  private isReady: { [id: string]: boolean }
  private isDead: boolean[]
  private rolesById: IRolesById
  private roles: IRole[]
  private gameLogs: GameLog[]
  private currentDay: number

  constructor() {
    this.isRunning = false
    this.players = []
    this.roles = []
    this.rolesById = {}
    this.isReady = {}
    this.isDead = []
    this.gameLogs = []
    this.currentDay = 0
  }

  public getPlayers(): IPlayer[] {
    return this.players
  }

  public getAlivePlayers() {
    return this.players.filter((_, idx) => !this.isDead[idx])
  }

  public togglePlayerReady(id: string): IPlayerReady[] {
    this.isReady[id] = !this.isReady[id]
    return this.players.map(player => ({
      ...player,
      isReady: this.isReady[player.id] || false,
    }))
  }

  public updateGameLog(updatingLog: Partial<GameLog>): void {
    const currentLog = this.gameLogs[this.currentDay]
    this.gameLogs[this.currentDay] = {
      ...currentLog,
      ...updatingLog,
    }
  }

  public addPlayer(player: IPlayer) {
    this.players.push(player)
    this.isReady[player.id] = false
    console.table(this.players)
    return player
  }

  public updatePlayer(id: string, updatedPlayer: Partial<IPlayer>) {
    let updatingPlayer: IPlayer
    this.players = this.players.map(player => {
      if (player.id === id) {
        updatingPlayer = {
          ...player,
          ...updatedPlayer,
        }
        return updatingPlayer
      }

      return player
    })
    console.table(this.players)
    return updatingPlayer
  }

  public removePlayer(id: string) {
    const updatingPlayers = this.players.filter(player => player.id !== id)
    this.isReady[id] = undefined
    const removedCount = this.players.length - updatingPlayers.length
    this.players = updatingPlayers
    console.table(this.players)
    return removedCount
  }

  public addRole(id: Roles) {
    const role = RolesById[id]
    if (this.rolesById[id]) {
      this.rolesById[id].number++
    } else {
      this.rolesById[id] = {
        role,
        number: 1,
      }
    }
    console.table(this.rolesById)
    return this.rolesById[id]
  }

  public removeRole(id: Roles) {
    if (this.rolesById[id]) {
      if (this.rolesById[id].number === 1) {
        this.rolesById[id] = undefined
      } else {
        this.rolesById[id].number--
      }
    }
    console.table(this.rolesById)
    return this.rolesById[id]
  }

  private assignRoles() {
    const rolesCount = Object.values(this.rolesById).reduce((rs, it) => rs + it.number, 0)

    if (rolesCount !== this.players.length) {
      throw Error('Number of roles must match with number of players')
    }

    const playersIdx = shuffle(this.players.map((_, idx) => idx))
    let idx = 0
    this.roles = Object.values(this.rolesById).reduce((rs, { role, number }) => {
      for (let i = 0; i < number; i++) {
        const currentPlayer = this.players[playersIdx[idx]]
        role.players.push(currentPlayer)
        currentPlayer.role = role
        idx++
      }
      rs.push(role)
      return rs
    }, [] as IRole[]).sort((a, b) => a.priority - b.priority)
  }

  private unassignRoles() {
    this.players.forEach(player => player.role = undefined)
    this.roles.forEach(role => role.players = [])
  }

  private isWerewolvesWin(): boolean {
    const werewolves = this.players.filter((player, idx) => player.role.isWerewolf && !this.isDead[idx])
    const villagers = this.players.filter((player, idx) => !player.role.isWerewolf && !this.isDead[idx])
    return villagers.length <= werewolves.length
  }

  private isVillagersWin(): boolean {
    const werewolves = this.players.filter((player, idx) => player.role.isWerewolf && !this.isDead[idx])
    return werewolves.length <= 0
  }

  private shouldGameContinue(): boolean {
    return !(this.isVillagersWin() || this.isWerewolvesWin())
  }

  private init() {
    // assign roles
    this.assignRoles()

    // reset isDead
    this.isDead = Array(this.players.length).fill(false)

    // reset gameLogs & currentDay
    this.currentDay = 0
    this.gameLogs = [buildGameLog()]

    // start the game
    this.isRunning = true
  }

  private cleanUp() {
    // unassign roles
    this.unassignRoles()

    // stop the game
    this.isRunning = false
  }

  private processNightResult() {
    const currentLog = this.gameLogs[this.currentDay]
    const { werewolfVotedPlayer, killedPlayers } = currentLog

    // check who is voted by werewolves
    if (werewolfVotedPlayer) {
      killedPlayers.push(werewolfVotedPlayer)
    }

    this.players.forEach((player, idx) => {
      if (killedPlayers.some(killedPlayer => killedPlayer.id === player.id)) {
        this.isDead[idx] = true
      }
    })
  }

  private announceNightResult() {
    const { killedPlayers } = this.gameLogs[this.currentDay]
    const killedCount = killedPlayers.length
    const killedNames = killedPlayers.map(player => player.name).join(', ')
    const result = killedCount
      ? `Last night, there were ${killedCount} people died. It's ${killedNames}`
      : 'Last night, there were no people died. Thank god!'
    console.log(result)
  }

  private announceGameResult() {
    const isWerewolvesWin = this.isWerewolvesWin()
    const result = isWerewolvesWin ? 'Ooops, werewolves win :(' : 'Hoooray, we killed all the werewolves'
    console.log(result)
    console.log('===Game log===')
    console.log(this.gameLogs)
  }

  private async run() {
    // prepare everthing before game starts
    this.init()

    // game play
    // - call roles by priority
    // - player take action
    // - check if game should continue
    // - everyone wake up, announce the result
    let shouldGameContinue = this.shouldGameContinue()
    console.log('===Game start===')
    console.table(this.players.map(player => ({
      name: player.name,
      roleName: player.role.roleName,
    })))

    while (shouldGameContinue) {
      console.log('Everyone, go to sleep!')
      await this.roles.reduce(async (rs, role) => {
        await rs
        role.callWakeUp()
        await role.action(this)
        role.callSleep()
        return Promise.resolve()
      }, Promise.resolve())
      console.log(`Everyone, it's time to wake up!`)
      this.processNightResult()
      this.announceNightResult()
      shouldGameContinue = this.shouldGameContinue()
      if (shouldGameContinue) {
        console.log('Game is continue')
        this.currentDay++
        this.gameLogs.push(buildGameLog())
      }
    }
    this.announceGameResult()

    // clean up everything
    this.cleanUp()
  }

  public start() {
    if (this.isRunning) {
      throw Error('The game is running')
    }

    this.run()
    return 'Game started successfully'
  }
}
