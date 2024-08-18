import { BadRequestException, Injectable } from '@nestjs/common';
import { BookRepository } from 'src/infrastructure/repositories/book.repository';
import { Book } from './book.entity';
import { CreateBookDto } from 'src/application/dto/book/create-book.dto';
import { UpdateBookDto } from 'src/application/dto/book/update-book.dto';

@Injectable()
export class BookService {
  constructor(private readonly bookRepository: BookRepository) {}

  async findAll(): Promise<Book[]> {
    const books = await this.bookRepository.findAll();

    if (!books) {
      return [];
    }

    // Filter out books that have a borrowing record with `returnedAt` as null (meaning they are currently borrowed)
    const availableBooks = books.filter(
      (book) =>
        !book.borrowingRecord?.some((record) => record.returnedAt === null),
    );

    return availableBooks;
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.bookRepository.findById(id);

    if (!book) {
      throw new BadRequestException('Book tidak ditemukan');
    }

    return book;
  }

  async findByCode(code: string): Promise<Book> {
    const book = await this.bookRepository.findByCode(code);

    if (!book) {
      throw new BadRequestException('Book tidak ditemukan');
    }

    return book;
  }

  async create(createBookDto: CreateBookDto): Promise<void> {
    await this.bookRepository.create(createBookDto);

    return;
  }

  async update(code: string, updateBookDto: UpdateBookDto): Promise<void> {
    await this.findByCode(code);

    await this.bookRepository.update(code, updateBookDto);

    return;
  }
}
