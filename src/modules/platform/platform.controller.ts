import { Body, Controller, Get, Post } from '@nestjs/common';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CreatePackageDto } from './dto/create-package.dto';
import { PlatformService } from './platform.service';

@Controller('platform')
@Permissions('platform.manage')
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @Get('packages')
  findPackages() {
    return this.platformService.findPackages();
  }

  @Post('packages')
  createPackage(@Body() dto: CreatePackageDto) {
    return this.platformService.createPackage(dto);
  }

  @Get('schools')
  findSchools() {
    return this.platformService.findSchools();
  }
}
