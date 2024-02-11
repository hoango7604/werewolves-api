import { Roles } from '../../constants/role';
import { IRole } from './role';
import { Villager } from './villager';
import { Werewolf } from './werewolf';

export const RolesById: { [id in Roles]: IRole } = {
  [Roles.Werewolf]: new Werewolf(),
  [Roles.Villager]: new Villager(),
}
