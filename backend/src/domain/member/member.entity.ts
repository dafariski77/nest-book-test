import { z } from 'zod';
import {
  Member as PrismaMember,
  Book as PrismaBook,
  BorrowingRecord as PrismaBorrowingRecord,
} from '@prisma/client';
import {
  BorrowingRecordEntity,
  borrowingRecordSchema,
} from '../borrowing-record/borrowing-record.entity';

export const memberSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().min(1, { message: 'Code harus diisi' }),
  name: z.string().min(1, { message: 'Nama harus diisi' }),
  penaltyExpireAt: z.date().nullable().optional(),
  borrowingRecord: z.array(borrowingRecordSchema).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Member = z.infer<typeof memberSchema>;

export class MemberEntity implements Member {
  id?: string;
  code: string;
  name: string;
  penaltyExpireAt?: Date | null;
  borrowingRecord?: BorrowingRecordEntity[];
  createdAt?: Date;
  updatedAt?: Date;

  constructor(
    member: PrismaMember & {
      borrowingRecord?: (PrismaBorrowingRecord & { book: PrismaBook })[];
    },
  ) {
    this.id = member.id;
    this.code = member.code;
    this.name = member.name;
    this.penaltyExpireAt = member.penaltyExpireAt;
    this.createdAt = member.createdAt;
    this.updatedAt = member.updatedAt;

    this.borrowingRecord = member.borrowingRecord?.map(
      (record) =>
        new BorrowingRecordEntity({
          ...record,
          book: record.book, // Correctly pass the book relation
        }),
    );
  }
}
