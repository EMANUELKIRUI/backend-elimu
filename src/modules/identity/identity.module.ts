import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { IdentityController } from './identity.controller';
import { IdentityService } from './identity.service';

@Module({
  imports: [PrismaModule],
  controllers: [IdentityController],
  providers: [IdentityService],
})
export class IdentityModule {}
