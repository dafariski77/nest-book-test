import { Test, TestingModule } from '@nestjs/testing';
import { BorrowingRecordController } from './borrowing-record.controller';
import { BorrowingRecordService } from 'src/domain/borrowing-record/borrowing-record.service';
import { MemberRepository } from 'src/infrastructure/repositories/member.repository';
import { BookRepository } from 'src/infrastructure/repositories/book.repository';
import { BorrowingRecordRepository } from 'src/infrastructure/repositories/borrowing-record.repository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

describe('BorrowingRecordController', () => {
  let controller: BorrowingRecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BorrowingRecordController],
      providers: [
        BorrowingRecordService,
        MemberRepository,
        BookRepository,
        BorrowingRecordRepository,
        PrismaService,
      ],
    }).compile();

    controller = module.get<BorrowingRecordController>(
      BorrowingRecordController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
