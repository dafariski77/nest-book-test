import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common';
import { ZodPipe } from '../../pipes/zod-validation.pipe';
import { Book, bookSchema } from 'src/domain/book/book.entity';
import {
  CreateBookDto,
  CreateBookDtoAPI,
} from '../../dto/book/create-book.dto';
import { IAPIResponse } from 'src/application/interfaces/api-response.interface';
import { ApiResponse } from 'src/application/utils/api-response';
import { BookService } from 'src/domain/book/book.service';
import {
  ApiBody,
  ApiOperation,
  ApiTags,
  ApiResponse as SwaggerApiResponse,
} from '@nestjs/swagger';

@ApiTags('books')
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @HttpCode(200)
  @ApiOperation({ summary: 'Get semua data buku' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Buku ditemukan',
  })
  @Get()
  async findAll(): Promise<IAPIResponse<Book[] | null>> {
    const books = await this.bookService.findAll();

    return ApiResponse.success('Berhasil mendapatkan data buku', books);
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Get single data buku' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Buku ditemukan',
  })
  @SwaggerApiResponse({
    status: 400,
    description: 'Buku tidak ditemukan',
  })
  @Get(':code')
  async findOne(@Param('code') code: string): Promise<IAPIResponse<Book>> {
    const book = await this.bookService.findByCode(code);

    return ApiResponse.success('Berhasil mendapatkan data buku', book);
  }

  @HttpCode(201)
  @ApiOperation({ summary: 'Tambah buku baru' })
  @SwaggerApiResponse({
    status: 201,
    description: 'Buku berhasil ditambahkan',
  })
  @SwaggerApiResponse({
    status: 400,
    description: 'Validation Error',
  })
  @ApiBody({ type: CreateBookDtoAPI })
  @UsePipes(new ZodPipe(bookSchema))
  @Post()
  async create(
    @Body() createBookDto: CreateBookDto,
  ): Promise<IAPIResponse<void>> {
    await this.bookService.create(createBookDto);

    return ApiResponse.success('Berhasil menambahkan buku');
  }
}
