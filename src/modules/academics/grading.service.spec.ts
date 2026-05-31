import { GradingService } from './grading.service';

describe('GradingService', () => {
  const prisma = {
    gradeScale: {
      findFirst: jest.fn(),
    },
  };

  beforeEach(() => {
    prisma.gradeScale.findFirst.mockReset();
  });

  it('returns the matching grade range for a score', async () => {
    prisma.gradeScale.findFirst.mockResolvedValue({
      ranges: [
        { minScore: 80, maxScore: 100, grade: 'A', points: 12 },
        { minScore: 70, maxScore: 79, grade: 'B', points: 10 },
      ],
    });

    const service = new GradingService(prisma as any);

    await expect(service.gradeScore('school-1', 75)).resolves.toEqual({
      grade: 'B',
      points: 10,
    });
    expect(prisma.gradeScale.findFirst).toHaveBeenCalledWith({
      where: { schoolId: 'school-1', isDefault: true },
      include: { ranges: true },
    });
  });

  it('returns null grade fields when no range matches', async () => {
    prisma.gradeScale.findFirst.mockResolvedValue({
      ranges: [{ minScore: 80, maxScore: 100, grade: 'A', points: 12 }],
    });

    const service = new GradingService(prisma as any);

    await expect(service.gradeScore('school-1', 60)).resolves.toEqual({
      grade: null,
      points: null,
    });
  });
});
