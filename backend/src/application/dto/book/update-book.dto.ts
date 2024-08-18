import { bookSchema } from 'src/domain/book/book.entity';
import { z } from 'zod';

const updateBookDto = bookSchema.partial().omit({
  id: true,
  borrowingRecord: true,
  createdAt: true,
  updatedAt: true,
});

export type UpdateBookDto = z.infer<typeof updateBookDto>;
