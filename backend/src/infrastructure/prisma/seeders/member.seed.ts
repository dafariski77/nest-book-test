import { PrismaClient } from '@prisma/client';

async function memberSeeder(prisma: PrismaClient) {
  const members = [
    {
      code: 'M001',
      name: 'Angga',
    },
    {
      code: 'M002',
      name: 'Ferry',
    },
    {
      code: 'M003',
      name: 'Putri',
    },
  ];

  await prisma.member.createMany({
    data: members,
  });

  return;
}

export default memberSeeder;
