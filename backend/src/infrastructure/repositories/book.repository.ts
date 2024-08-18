import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CreateBookDto } from 'src/application/dto/book/create-book.dto';
import { BookEntity } from 'src/domain/book/book.entity';
import { UpdateBookDto } from 'src/application/dto/book/update-book.dto';

@Injectable()
export class BookRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<BookEntity[] | null> {
    const books = await this.prisma.book.findMany({
      include: {
        borrowingRecord: true,
      },
    });

    return books.map((book) => new BookEntity(book));
  }

  async findById(id: string): Promise<BookEntity | null> {
    const book = await this.prisma.book.findFirst({
      where: {
        id,
      },
      include: {
        borrowingRecord: true,
      },
    });

    return book ? new BookEntity(book) : null;
  }

  async findByCode(code: string): Promise<BookEntity | null> {
    const book = await this.prisma.book.findFirst({
      where: {
        code,
      },
      include: {
        borrowingRecord: true,
      },
    });

    return book ? new BookEntity(book) : null;
  }

  async create(createBookDto: CreateBookDto): Promise<void> {
    await this.prisma.book.create({
      data: createBookDto,
    });

    return;
  }

  async update(code: string, updateBookDto: UpdateBookDto): Promise<void> {
    await this.prisma.book.update({
      where: {
        code,
      },
      data: updateBookDto,
    });

    return;
  }
}
