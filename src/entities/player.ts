import { v4 as uuid } from 'uuid'

import { IRole } from './roles/role'

export interface IPlayer {
  id: string
  name: string
  imgUrl?: string
  role?: IRole
  selectPlayerForAction(id: string): void
  handlePlayerSelection(question: string, players: IPlayer[]): Promise<IPlayer | null>
}

export class Player implements IPlayer {
  private promiseSelectPlayerAnswer: Promise<string>
  private promiseSelectPlayerResolver: (id: string) => void

  id: string
  name: string
  imgUrl?: string
  role?: IRole

  constructor(name: string, imgUrl = '') {
    this.id = uuid()
    this.name = name
    this.imgUrl = imgUrl
  }

  public selectPlayerForAction(id: string): void {
    this.promiseSelectPlayerResolver(id)
  }

  public async handlePlayerSelection(question: string, players: IPlayer[]): Promise<IPlayer | null> {
    let selectedPlayer: IPlayer = undefined
    while (true) {
      this.promiseSelectPlayerAnswer = new Promise(resolve => this.promiseSelectPlayerResolver = resolve)
      const answer = await this.promiseSelectPlayerAnswer
      console.log(question, answer)
      if (Number.isInteger(+answer) && +answer <= players.length) {
        const idx = +answer
        if (idx === -1) {
          selectedPlayer = null
        } else {
          selectedPlayer = players[+answer]
        }
      }
      if (selectedPlayer !== undefined) {
        return selectedPlayer
      }
      console.log('Invalid answer. Please select again')
      this.promiseSelectPlayerAnswer = undefined
      this.promiseSelectPlayerResolver = undefined
    }
  }
}
