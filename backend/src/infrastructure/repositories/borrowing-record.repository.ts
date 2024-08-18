import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BorrowingRecordEntity } from 'src/domain/borrowing-record/borrowing-record.entity';
import { CreateBorrowingRecordDto } from 'src/application/dto/borrowing-record/create-borrowing-record.dto';
import { UpdateBorrowingRecordDto } from 'src/application/dto/borrowing-record/update-borrowing-record.dto';

@Injectable()
export class BorrowingRecordRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findBorrowingRecordsByMember(
    memberCode: string,
  ): Promise<BorrowingRecordEntity[]> {
    return await this.prisma.borrowingRecord.findMany({
      where: {
        memberCode,
      },
    });
  }

  async findBorrowingRecordForReturn(
    memberCode: string,
    bookCode: string,
  ): Promise<BorrowingRecordEntity | null> {
    return await this.prisma.borrowingRecord.findFirst({
      where: {
        memberCode,
        AND: {
          bookCode,
          AND: {
            returnedAt: null,
          },
        },
      },
    });
  }

  async create(
    createBorrowingRecordDto: CreateBorrowingRecordDto,
  ): Promise<void> {
    await this.prisma.borrowingRecord.create({
      data: createBorrowingRecordDto,
    });

    return;
  }

  async findOne(id: string): Promise<BorrowingRecordEntity | null> {
    const book = await this.prisma.borrowingRecord.findFirst({
      where: {
        id,
      },
    });

    console.log(book);

    return book;
  }

  async update(
    id: string,
    updateBorrowingRecordDto: UpdateBorrowingRecordDto,
  ): Promise<void> {
    await this.prisma.borrowingRecord.update({
      where: {
        id,
      },
      data: updateBorrowingRecordDto,
    });

    return;
  }
}
