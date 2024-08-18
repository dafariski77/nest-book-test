import { z } from 'zod';

export const updateBorrowingRecordSchema = z.object({
  memberCode: z.string().min(1, { message: 'Kode member harus diisi!' }),
  bookCode: z.string().min(1, { message: 'Kode buku harus diisi!' }),
  penalty: z.boolean().optional(),
  borrowedAt: z.date().optional(),
  returnedAt: z.date().nullable().optional(),
});

export type UpdateBorrowingRecordDto = z.infer<
  typeof updateBorrowingRecordSchema
>;
