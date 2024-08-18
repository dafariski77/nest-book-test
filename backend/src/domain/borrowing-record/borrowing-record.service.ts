import { BadRequestException, Injectable } from '@nestjs/common';
import { BorrowBookDto } from 'src/application/dto/borrowing-record/borrow-book.dto';
import { ReturnBookDto } from 'src/application/dto/borrowing-record/return-book.dto';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { BookRepository } from 'src/infrastructure/repositories/book.repository';
import { BorrowingRecordRepository } from 'src/infrastructure/repositories/borrowing-record.repository';
import { MemberRepository } from 'src/infrastructure/repositories/member.repository';

@Injectable()
export class BorrowingRecordService {
  constructor(
    private readonly borrowingRecordRepository: BorrowingRecordRepository,
    private readonly memberRepository: MemberRepository,
    private readonly bookRepository: BookRepository,
    private readonly prismaService: PrismaService,
  ) {}

  async borrowBook(borrowBookDto: BorrowBookDto) {
    await this.prismaService.$transaction(async (prisma) => {
      const { bookCode, memberCode } = borrowBookDto;

      const dateNow = new Date();

      const member = await this.memberRepository.findByCode(memberCode);
      if (!member) {
        throw new BadRequestException('Member tidak ditemukan');
      }

      if (member.penaltyExpireAt && dateNow < member.penaltyExpireAt) {
        throw new BadRequestException('Member sedang dalam penalty');
      }

      const book = await this.bookRepository.findByCode(bookCode);
      if (!book) {
        throw new BadRequestException('Buku tidak ditemukan');
      }

      if (book.stock == 0) {
        throw new BadRequestException('Stok buku kosong');
      }

      const memberRecords =
        (await this.borrowingRecordRepository.findBorrowingRecordsByMember(
          memberCode,
        )) || [];

      const activeMemberRecords = memberRecords.filter(
        (record) => !record.returnedAt,
      );

      if (activeMemberRecords.length >= 2) {
        throw new BadRequestException(
          'Member tidak bisa meminjam lebih dari 2 buku',
        );
      }

      const isBorrowed = book.borrowingRecord?.some(
        (record) => !record.returnedAt,
      );

      if (isBorrowed) {
        throw new BadRequestException(
          'Buku sedang dipinjam oleh pengguna lain',
        );
      }

      const newStock = book.stock - 1;
      await this.bookRepository.update(bookCode, {
        stock: newStock,
      });

      await this.borrowingRecordRepository.create({
        bookCode,
        memberCode,
        borrowedAt: dateNow,
      });

      return;
    });
  }

  async returnBook(returnBookDto: ReturnBookDto) {
    await this.prismaService.$transaction(async (prisma) => {
      const dateNow = new Date();

      const memberRecord = await this.borrowingRecordRepository.findOne(
        returnBookDto.id,
      );

      if (!memberRecord) {
        throw new BadRequestException('Data peminjaman tidak ditemukan');
      }

      const memberCode = memberRecord.memberCode;
      const bookCode = memberRecord.bookCode;

      if (!memberCode || !bookCode) {
        throw new BadRequestException('Member code or book code is undefined');
      }

      const borrowingRecord =
        await this.borrowingRecordRepository.findBorrowingRecordForReturn(
          memberCode,
          bookCode,
        );

      if (!borrowingRecord) {
        throw new BadRequestException('Data peminjaman tidak ditemukan');
      }

      const borrowDate = borrowingRecord.borrowedAt;

      let diffDays = 0;

      if (borrowDate) {
        const diffTime = Math.abs(dateNow.getTime() - borrowDate.getTime());
        diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      } else {
        throw new BadRequestException('Tanggal peminjaman tidak valid');
      }

      const memberData = await this.memberRepository.findByCode(
        borrowingRecord.memberCode,
      );

      if (!memberData) {
        throw new BadRequestException('Member tidak ditemukan');
      }

      const memberId = memberData.id;

      if (memberId && diffDays > 7) {
        const penaltyEndDate = new Date(
          dateNow.getTime() + 3 * 24 * 60 * 60 * 1000,
        );

        await this.memberRepository.update(memberId, {
          penaltyExpireAt: penaltyEndDate,
        });

        await this.borrowingRecordRepository.update(returnBookDto.id, {
          penalty: true,
          memberCode,
          bookCode,
        });
      }

      // stok + 1
      const book = await this.bookRepository.findByCode(bookCode);

      if (!book) {
        throw new BadRequestException('Buku tidak ditemukan');
      }

      const newStock = book.stock + 1;
      await this.bookRepository.update(bookCode, {
        stock: newStock,
      });

      await this.borrowingRecordRepository.update(returnBookDto.id, {
        memberCode,
        bookCode,
        returnedAt: dateNow,
      });

      return;
    });
  }
}
