import { Controller, Delete, Param, Post } from '@nestjs/common';

import { Roles } from '../../constants/role';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post('/:id')
  addRole(@Param('id') id: Roles) {
    return this.roleService.addRole(id)
  }

  @Delete('/:id')
  removeRole(@Param('id') id: Roles) {
    return this.roleService.removeRole(id)
  }
}
