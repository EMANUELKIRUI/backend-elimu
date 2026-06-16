import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantsService } from './tenants.service';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get()
  @Permissions('platform.manage')
  getAll() {
    return this.tenantsService.findAll();
  }

  @Get(':id')
  @Permissions('platform.manage')
  getOne(@Param('id') id: string) {
    return this.tenantsService.findOne(id);
  }

  @Post()
  @Permissions('platform.manage')
  create(@Body() dto: CreateTenantDto) {
    return this.tenantsService.create(dto);
  }

  @Patch(':id')
  @Permissions('platform.manage')
  update(@Param('id') id: string, @Body() dto: UpdateTenantDto) {
    return this.tenantsService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('platform.manage')
  remove(@Param('id') id: string) {
    return this.tenantsService.remove(id);
  }
}
