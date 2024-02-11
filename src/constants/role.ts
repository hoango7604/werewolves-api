export enum Roles {
  Werewolf,
  Villager,
}

export interface IRoleConfig {
  id: Roles,
  roleName: string,
  priority: number,
  imgUrl?: string,
  isWerewolf?: boolean,
}

export const RolesConfig: { [id in Roles]: IRoleConfig } = {
  [Roles.Werewolf]: {
    id: Roles.Werewolf,
    roleName: 'Werewolf',
    priority: 1,
    imgUrl: '',
    isWerewolf: true
  },
  [Roles.Villager]: {
    id: Roles.Villager,
    roleName: 'Villager',
    priority: 100,
    imgUrl: ''
  }
}
