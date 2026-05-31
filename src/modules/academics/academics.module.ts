import { Module } from '@nestjs/common';
import { AcademicsController } from './academics.controller';
import { AcademicsService } from './academics.service';
import { GradingService } from './grading.service';

@Module({
  controllers: [AcademicsController],
  providers: [AcademicsService, GradingService],
})
export class AcademicsModule {}
