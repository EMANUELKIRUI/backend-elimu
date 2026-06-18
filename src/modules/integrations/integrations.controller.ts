import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { AuthUser } from '../../common/types/auth-user';
import { CreateIntegrationDto } from './dto/create-integration.dto';
import { UpdateIntegrationDto } from './dto/update-integration.dto';
import { IntegrationsService } from './integrations.service';

@ApiTags('integrations')
@ApiBearerAuth()
@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get()
  @Permissions('integrations.view')
  @ApiOperation({ summary: 'Get all integration endpoints' })
  @ApiResponse({ status: 200, description: 'Integrations retrieved successfully' })
  getAll(@CurrentUser() user: AuthUser) {
    return this.integrationsService.findAll(user);
  }

  @Post()
  @Permissions('integrations.manage')
  @ApiOperation({ summary: 'Create a new integration endpoint' })
  @ApiResponse({ status: 201, description: 'Integration created successfully' })
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateIntegrationDto) {
    return this.integrationsService.create(user, dto);
  }

  @Patch(':id')
  @Permissions('integrations.manage')
  @ApiOperation({ summary: 'Update an integration endpoint' })
  @ApiResponse({ status: 200, description: 'Integration updated successfully' })
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateIntegrationDto,
  ) {
    return this.integrationsService.update(user, id, dto);
  }

  @Delete(':id')
  @Permissions('integrations.manage')
  @ApiOperation({ summary: 'Delete an integration endpoint' })
  @ApiResponse({ status: 200, description: 'Integration deleted successfully' })
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.integrationsService.remove(user, id);
  }
}
