import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './infrastructure/prisma/prisma.service';
import { BookController } from './application/controllers/book/book.controller';
import { BorrowingRecordController } from './application/controllers/borrowing-record/borrowing-record.controller';
import { MemberController } from './application/controllers/member/member.controller';
import { BookService } from './domain/book/book.service';
import { MemberService } from './domain/member/member.service';
import { BorrowingRecordService } from './domain/borrowing-record/borrowing-record.service';
import { BookRepository } from './infrastructure/repositories/book.repository';
import { MemberRepository } from './infrastructure/repositories/member.repository';
import { BorrowingRecordRepository } from './infrastructure/repositories/borrowing-record.repository';

@Module({
  imports: [],
  controllers: [
    AppController,
    BookController,
    BorrowingRecordController,
    MemberController,
  ],
  providers: [
    AppService,
    PrismaService,
    BookService,
    MemberService,
    BorrowingRecordService,
    BookRepository,
    MemberRepository,
    BorrowingRecordRepository,
  ],
})
export class AppModule {}
