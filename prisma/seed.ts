import { PrismaClient, CurriculumType } from '@prisma/client';
import { hash } from '@node-rs/argon2';

const prisma = new PrismaClient();

const permissions = [
  'platform.manage',
  'schools.create',
  'schools.view',
  'users.manage',
  'roles.manage',
  'students.view',
  'students.create',
  'attendance.view',
  'attendance.create',
  'academics.view',
  'academics.configure',
  'exams.create',
  'marks.view',
  'marks.create',
  'marks.submit',
  'marks.approve',
  'marks.lock',
  'finance.view',
  'finance.create',
  'finance.submit',
  'finance.approve.deputy',
  'finance.approve.principal',
  'reports.view',
  'reports.create',
  'communication.send',
  'boarding.view',
  'transport.view',
  'inventory.view',
  'discipline.view',
];

const rolePermissions: Record<string, string[]> = {
  'Platform Admin': ['platform.manage', 'schools.create'],
  'School Admin': permissions.filter((item) => item !== 'platform.manage'),
  Principal: [
    'schools.view',
    'students.view',
    'attendance.view',
    'academics.view',
    'marks.view',
    'marks.approve',
    'marks.lock',
    'finance.view',
    'finance.approve.principal',
    'reports.view',
    'communication.send',
    'boarding.view',
    'transport.view',
    'inventory.view',
    'discipline.view',
  ],
  'Deputy Principal Administration': [
    'schools.view',
    'students.view',
    'attendance.view',
    'attendance.create',
    'finance.view',
    'finance.approve.deputy',
    'communication.send',
    'boarding.view',
    'transport.view',
    'inventory.view',
    'discipline.view',
  ],
  'Deputy Principal Academics': [
    'schools.view',
    'students.view',
    'attendance.view',
    'academics.view',
    'academics.configure',
    'exams.create',
    'marks.view',
    'marks.approve',
    'marks.lock',
    'reports.view',
    'communication.send',
  ],
  Bursar: [
    'schools.view',
    'students.view',
    'finance.view',
    'finance.create',
    'finance.submit',
    'communication.send',
  ],
  HOD: [
    'schools.view',
    'students.view',
    'attendance.view',
    'academics.view',
    'marks.view',
    'marks.submit',
  ],
  Teacher: [
    'schools.view',
    'students.view',
    'attendance.view',
    'attendance.create',
    'academics.view',
    'marks.view',
    'marks.create',
  ],
  'Board Chairperson': [
    'schools.view',
    'students.view',
    'attendance.view',
    'academics.view',
    'marks.view',
    'finance.view',
    'reports.view',
    'boarding.view',
    'transport.view',
    'inventory.view',
    'discipline.view',
  ],
};

async function main() {
  for (const action of permissions) {
    await prisma.permission.upsert({
      where: { action },
      update: {},
      create: { action },
    });
  }

  for (const [name, actions] of Object.entries(rolePermissions)) {
    const role =
      (await prisma.role.findFirst({
        where: { schoolId: null, name },
      })) ??
      (await prisma.role.create({
        data: { name, systemRole: true },
      }));

    for (const action of actions) {
      const permission = await prisma.permission.findUniqueOrThrow({
        where: { action },
      });
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: { roleId: role.id, permissionId: permission.id },
      });
    }
  }

  const packageModules = [
    'students',
    'attendance',
    'academics',
    'finance',
    'communication',
    'hr',
    'inventory',
    'procurement',
    'library',
    'boarding',
    'transport',
    'health',
    'discipline',
    'events',
    'analytics',
  ];

  await prisma.subscriptionPackage.upsert({
    where: { name: 'Enterprise' },
    update: { modules: packageModules },
    create: {
      name: 'Enterprise',
      description: 'Full AfricaSchool EduOS ERP package',
      monthlyFee: 0,
      modules: packageModules,
    },
  });

  const curricula = [
    [CurriculumType.KENYA_CBC, 'Kenya CBC', 'Kenya'],
    [CurriculumType.KENYA_844, 'Kenya 8-4-4', 'Kenya'],
    [CurriculumType.GENERIC_MARKS, 'Generic Marks-Based Curriculum', null],
    [
      CurriculumType.GENERIC_COMPETENCY,
      'Generic Competency-Based Curriculum',
      null,
    ],
  ] as const;

  for (const [type, name, country] of curricula) {
    await prisma.curriculum.create({
      data: { type, name, country },
    }).catch(() => undefined);
  }

  const passwordHash = await hash('Admin@12345');
  const platformAdmin = await prisma.user.upsert({
    where: { username: 'platform-admin' },
    update: {},
    create: {
      username: 'platform-admin',
      email: 'platform-admin@africaschool.local',
      passwordHash,
      firstName: 'Platform',
      lastName: 'Admin',
    },
  });

  const platformRole = await prisma.role.findFirstOrThrow({
    where: { name: 'Platform Admin', schoolId: null },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: platformAdmin.id,
        roleId: platformRole.id,
      },
    },
    update: {},
    create: {
      userId: platformAdmin.id,
      roleId: platformRole.id,
    },
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
