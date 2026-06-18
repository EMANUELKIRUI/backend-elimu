import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { PermissionsService } from './permissions.service';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @Permissions('permissions.view')
  getAll() {
    return this.permissionsService.findAll();
  }

  @Post()
  @Permissions('permissions.manage')
  create(@Body() dto: CreatePermissionDto) {
    return this.permissionsService.create(dto);
  }

  @Delete(':id')
  @Permissions('permissions.manage')
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }
}
