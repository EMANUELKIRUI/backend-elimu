import { Body, Controller, Get, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { AuthUser } from '../../common/types/auth-user';
import { IdentityService } from './identity.service';

@Controller()
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}

  @Get('users')
  @Permissions('users.manage')
  findUsers(@CurrentUser() user: AuthUser) {
    return this.identityService.findUsers(user);
  }

  @Post('users')
  @Permissions('users.manage')
  createUser(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.identityService.createUser(user, body);
  }

  @Get('roles')
  @Permissions('roles.manage')
  findRoles(@CurrentUser() user: AuthUser) {
    return this.identityService.findRoles(user);
  }

  @Post('roles')
  @Permissions('roles.manage')
  createRole(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.identityService.createRole(user, body);
  }

  @Post('roles/assign')
  @Permissions('roles.manage')
  assignRole(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.identityService.assignRole(user, body);
  }

  @Get('permissions')
  @Permissions('roles.manage')
  findPermissions() {
    return this.identityService.findPermissions();
  }

  @Post('permissions/assign')
  @Permissions('roles.manage')
  assignPermission(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.identityService.assignPermission(user, body);
  }
}
