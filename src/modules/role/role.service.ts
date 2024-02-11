import { Injectable } from '@nestjs/common';

import { Roles } from '../../constants/role';
import { Game } from '../../entities/game';

@Injectable()
export class RoleService {
  constructor(private game: Game) {}

  addRole(id: Roles) {
    return this.game.addRole(id)
  }

  removeRole(id: Roles) {
    return this.game.removeRole(id)
  }
}
