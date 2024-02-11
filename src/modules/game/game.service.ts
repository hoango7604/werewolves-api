import { Injectable } from '@nestjs/common';

import { Game } from '../../entities/game';
import { Roles } from '../../constants/role';

@Injectable()
export class GameService {
  constructor(private game: Game) {}

  start() {
    return this.game.start()
  }
}
