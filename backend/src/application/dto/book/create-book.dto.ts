import { ApiProperty } from '@nestjs/swagger';
import { bookSchema } from 'src/domain/book/book.entity';
import { z } from 'zod';

const createBookDto = bookSchema.omit({
  id: true,
  borrowingRecord: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateBookDto = z.infer<typeof createBookDto>;

export class CreateBookDtoAPI {
  @ApiProperty({
    description: 'Kode buku',
    type: String,
    example: 'JK-45',
    required: true,
  })
  code: string;

  @ApiProperty({
    description: 'Judul buku',
    type: String,
    example: 'Harry Potter',
    required: true,
  })
  title: string;

  @ApiProperty({
    description: 'Penulis buku',
    type: String,
    example: 'J.K Rowling',
    required: true,
  })
  author: string;

  @ApiProperty({
    description: 'Stok buku',
    type: Number,
    example: 3,
    required: true,
  })
  stock: number;
}
