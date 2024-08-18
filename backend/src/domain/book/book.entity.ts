import { z } from 'zod';
import {
  Book as PrismaBook,
  BorrowingRecord as PrismaBorrowingRecord,
} from '@prisma/client';
import {
  BorrowingRecordEntity,
  borrowingRecordSchema,
} from '../borrowing-record/borrowing-record.entity';

export const bookSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().min(1, { message: 'Code harus diisi' }),
  title: z.string().min(1, { message: 'Title harus diisi' }),
  author: z.string().min(1, { message: 'Author harus diisi' }),
  stock: z.number({ required_error: 'Stock harus diisi' }),
  borrowingRecord: z.array(borrowingRecordSchema).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Book = z.infer<typeof bookSchema>;

export class BookEntity implements Book {
  id?: string;
  code: string;
  title: string;
  author: string;
  stock: number;
  borrowingRecord?: BorrowingRecordEntity[];
  createdAt?: Date;
  updatedAt?: Date;

  constructor(
    book: PrismaBook & { borrowingRecord?: PrismaBorrowingRecord[] },
  ) {
    this.id = book.id;
    this.code = book.code;
    this.title = book.title;
    this.author = book.author;
    this.stock = book.stock;
    this.createdAt = book.createdAt;
    this.updatedAt = book.updatedAt;

    this.borrowingRecord = book.borrowingRecord?.map(
      (record) => new BorrowingRecordEntity(record),
    );
  }
}
