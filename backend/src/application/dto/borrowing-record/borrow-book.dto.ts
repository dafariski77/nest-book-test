import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const borrowBookSchema = z.object({
  memberCode: z.string().min(1, { message: 'Kode member harus diisi!' }),
  bookCode: z.string().min(1, { message: 'Kode buku harus diisi!' }),
});

export type BorrowBookDto = z.infer<typeof borrowBookSchema>;

export class BorrowBookDtoAPI {
  @ApiProperty({
    description: 'Kode buku',
    type: String,
    example: 'JK-45',
    required: true,
  })
  bookCode: string;

  @ApiProperty({
    description: 'Kode member',
    type: String,
    example: 'M001',
    required: true,
  })
  memberCode: string;
}
