import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GradingService {
  constructor(private readonly prisma: PrismaService) {}

  async gradeScore(schoolId: string, score: number) {
    const scale = await this.prisma.gradeScale.findFirst({
      where: { schoolId, isDefault: true },
      include: { ranges: true },
    });

    const range = scale?.ranges.find(
      (item) =>
        Number(item.minScore) <= score && Number(item.maxScore) >= score,
    );

    return {
      grade: range?.grade ?? null,
      points: range?.points ?? null,
    };
  }
}
