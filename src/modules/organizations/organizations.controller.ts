import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationsService } from './organizations.service';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  @Permissions('platform.manage')
  getAll() {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  @Permissions('platform.manage')
  getOne(@Param('id') id: string) {
    return this.organizationsService.findOne(id);
  }

  @Post()
  @Permissions('platform.manage')
  create(@Body() dto: CreateOrganizationDto) {
    return this.organizationsService.create(dto);
  }

  @Patch(':id')
  @Permissions('platform.manage')
  update(@Param('id') id: string, @Body() dto: UpdateOrganizationDto) {
    return this.organizationsService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('platform.manage')
  remove(@Param('id') id: string) {
    return this.organizationsService.remove(id);
  }
}
