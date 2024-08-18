import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const returnBookSchema = z.object({
  id: z.string().min(1, { message: 'Id peminjaman harus diisi!' }),
});

export type ReturnBookDto = z.infer<typeof returnBookSchema>;

export class ReturnBookDtoAPI {
  @ApiProperty({
    description: 'Id Pinjam',
    type: String,
    example: '2cace9f9-fb0d-4935-99ba-1afd9b9bed5d',
    required: true,
  })
  id: string;
}
