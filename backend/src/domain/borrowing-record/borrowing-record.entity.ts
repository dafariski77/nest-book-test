import { z } from 'zod';
import {
  BorrowingRecord as PrismaBorrowingRecord,
  Member as PrismaMember,
  Book as PrismaBook,
} from '@prisma/client';
import { MemberEntity, memberSchema } from '../member/member.entity';
import { BookEntity, bookSchema } from '../book/book.entity';

export const borrowingRecordSchema = z.object({
  id: z.string().uuid().optional(),
  memberCode: z.string().uuid(),
  bookCode: z.string().uuid(),
  borrowedAt: z.date().optional(),
  returnedAt: z.date().nullable().optional(),
  penalty: z.boolean().optional(),
  member: z.array(memberSchema).optional(),
  book: z.array(bookSchema).optional(),
});

export type BorrowingRecord = z.infer<typeof borrowingRecordSchema>;

export class BorrowingRecordEntity implements BorrowingRecord {
  id?: string;
  memberCode: string;
  bookCode: string;
  borrowedAt?: Date;
  returnedAt?: Date | null;
  penalty?: boolean;
  member?: MemberEntity;
  book?: BookEntity;

  constructor(
    borrowingRecord: PrismaBorrowingRecord & {
      member?: PrismaMember;
      book?: PrismaBook;
    },
  ) {
    this.id = borrowingRecord.id;
    this.memberCode = borrowingRecord.memberCode;
    this.bookCode = borrowingRecord.bookCode;
    this.borrowedAt = borrowingRecord.borrowedAt;
    this.returnedAt = borrowingRecord.returnedAt;
    this.penalty = borrowingRecord.penalty;

    if (borrowingRecord.member) {
      this.member = new MemberEntity(borrowingRecord.member);
    }

    if (borrowingRecord.book) {
      this.book = new BookEntity(borrowingRecord.book);
    }
  }
}
