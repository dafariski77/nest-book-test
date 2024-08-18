import { PrismaClient } from '@prisma/client';
import bookSeeder from './book.seed';
import memberSeeder from './member.seed';

const prisma = new PrismaClient();

async function main() {
  await bookSeeder(prisma);

  await memberSeeder(prisma);

  return;
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    await prisma.$disconnect();
    process.exit(1);
  });
