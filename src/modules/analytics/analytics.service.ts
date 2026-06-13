import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  kpis() {
    return { enrollment: 0, attendance: 0 };
  }
}
