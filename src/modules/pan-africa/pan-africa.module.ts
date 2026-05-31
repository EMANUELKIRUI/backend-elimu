import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PanAfricaController } from './pan-africa.controller';
import { PanAfricaService } from './pan-africa.service';

@Module({
  imports: [PrismaModule],
  controllers: [PanAfricaController],
  providers: [PanAfricaService],
})
export class PanAfricaModule {}
