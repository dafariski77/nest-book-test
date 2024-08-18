import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiTags,
  ApiResponse as SwaggerApiResponse,
} from '@nestjs/swagger';
import {
  BorrowBookDto,
  BorrowBookDtoAPI,
  borrowBookSchema,
} from 'src/application/dto/borrowing-record/borrow-book.dto';
import {
  ReturnBookDto,
  ReturnBookDtoAPI,
  returnBookSchema,
} from 'src/application/dto/borrowing-record/return-book.dto';
import { ZodPipe } from 'src/application/pipes/zod-validation.pipe';
import { ApiResponse } from 'src/application/utils/api-response';
import { BorrowingRecordService } from 'src/domain/borrowing-record/borrowing-record.service';

@ApiTags('borrows')
@Controller('transaction')
export class BorrowingRecordController {
  constructor(
    private readonly borrowingRecordService: BorrowingRecordService,
  ) {}

  @HttpCode(200)
  @ApiOperation({ summary: 'Pinjam buku' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Buku berhasil dipinjam',
  })
  @SwaggerApiResponse({
    status: 400,
    description: 'Validation Error',
  })
  @ApiBody({ type: BorrowBookDtoAPI })
  @UsePipes(new ZodPipe(borrowBookSchema))
  @Post('borrows')
  async borrowBook(@Body() borrowBookDto: BorrowBookDto) {
    await this.borrowingRecordService.borrowBook(borrowBookDto);

    return ApiResponse.success('Berhasil meminjam buku');
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Kembalikan buku' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Buku berhasil dikembalikan',
  })
  @SwaggerApiResponse({
    status: 400,
    description: 'Validation Error',
  })
  @ApiBody({ type: ReturnBookDtoAPI })
  @UsePipes(new ZodPipe(returnBookSchema))
  @Post('return')
  async returnBookSchema(@Body() returnBookDto: ReturnBookDto) {
    await this.borrowingRecordService.returnBook(returnBookDto);

    return ApiResponse.success('Berhasil mengembalikan buku');
  }
}
