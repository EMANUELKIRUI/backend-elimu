import { Controller, Get } from '@nestjs/common';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get()
  getRoot() {
    return {
      message: 'Elimu ERP Backend is running 🚀',
      health: '/health',
      api: '/api/v1',
    };
  }
}
