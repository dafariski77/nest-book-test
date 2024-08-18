import { Test, TestingModule } from '@nestjs/testing';
import { BorrowingRecordService } from './borrowing-record.service';
import { BorrowingRecordRepository } from 'src/infrastructure/repositories/borrowing-record.repository';
import { MemberRepository } from 'src/infrastructure/repositories/member.repository';
import { BookRepository } from 'src/infrastructure/repositories/book.repository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('BorrowingRecordService', () => {
  let service: BorrowingRecordService;
  let borrowingRecordRepository: BorrowingRecordRepository;
  let memberRepository: MemberRepository;
  let bookRepository: BookRepository;

  const mockBorrowingRecordRepository = {
    findBorrowingRecordsByMember: jest.fn(),
    findBorrowingRecordForReturn: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  const mockMemberRepository = {
    findByCode: jest.fn(),
    update: jest.fn(),
  };

  const mockBookRepository = {
    findByCode: jest.fn(),
    update: jest.fn(),
  };

  const mockPrismaService = {
    $transaction: jest.fn().mockImplementation((cb) => cb(mockPrismaService)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BorrowingRecordService,
        {
          provide: BorrowingRecordRepository,
          useValue: mockBorrowingRecordRepository,
        },
        { provide: MemberRepository, useValue: mockMemberRepository },
        { provide: BookRepository, useValue: mockBookRepository },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<BorrowingRecordService>(BorrowingRecordService);
    borrowingRecordRepository = module.get<BorrowingRecordRepository>(
      BorrowingRecordRepository,
    );
    memberRepository = module.get<MemberRepository>(MemberRepository);
    bookRepository = module.get<BookRepository>(BookRepository);
  });

  it('should not allow borrowing if the member is penalized', async () => {
    const borrowBookDto = { bookCode: 'JK-45', memberCode: 'M001' };
    const mockMember = {
      code: 'M001',
      penaltyExpireAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    };

    mockMemberRepository.findByCode.mockResolvedValue(mockMember);

    await expect(service.borrowBook(borrowBookDto)).rejects.toThrow(
      new BadRequestException('Member sedang dalam penalty'),
    );
  });

  it('should not allow borrowing if the book is already borrowed by another member', async () => {
    const borrowBookDto = { bookCode: 'SHR-1', memberCode: 'M001' };

    mockMemberRepository.findByCode.mockResolvedValue({ code: 'M001' });
    mockBookRepository.findByCode.mockResolvedValue({
      code: 'SHR-1',
      borrowingRecord: [{ returnedAt: null }],
    });

    await expect(service.borrowBook(borrowBookDto)).rejects.toThrow(
      new BadRequestException('Buku sedang dipinjam oleh pengguna lain'),
    );
  });

  it('should not allow borrowing if the member has already borrowed 2 books', async () => {
    const borrowBookDto = { bookCode: 'JK-45', memberCode: 'M001' };
    const mockMemberRecords = [{ returnedAt: null }, { returnedAt: null }];

    mockMemberRepository.findByCode.mockResolvedValue({ code: 'M001' });
    mockBorrowingRecordRepository.findBorrowingRecordsByMember.mockResolvedValue(
      mockMemberRecords,
    );

    await expect(service.borrowBook(borrowBookDto)).rejects.toThrow(
      new BadRequestException('Member tidak bisa meminjam lebih dari 2 buku'),
    );
  });

  it('should not allow borrowing if the book is out of stock', async () => {
    const borrowBookDto = { bookCode: 'JK-45', memberCode: 'M001' };
    const mockBook = { code: 'JK-45', stock: 0 };

    mockMemberRepository.findByCode.mockResolvedValue({ code: 'M001' });
    mockBookRepository.findByCode.mockResolvedValue(mockBook);

    await expect(service.borrowBook(borrowBookDto)).rejects.toThrow(
      new BadRequestException('Stok buku kosong'),
    );
  });

  it('should successfully return a book and update penalty if late', async () => {
    const returnBookDto = { id: '1' };
    const mockRecord = {
      id: '1',
      memberCode: 'M001',
      bookCode: 'JK-45',
      borrowedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    };

    mockBorrowingRecordRepository.findOne.mockResolvedValue(mockRecord);
    mockBorrowingRecordRepository.findBorrowingRecordForReturn.mockResolvedValue(
      mockRecord,
    );
    mockMemberRepository.findByCode.mockResolvedValue({
      id: '1',
      code: 'M001',
    });
    mockBookRepository.findByCode.mockResolvedValue({
      code: 'JK-45',
      stock: 1,
    });

    await service.returnBook(returnBookDto);

    expect(mockMemberRepository.update).toHaveBeenCalledWith(
      '1',
      expect.any(Object),
    );
    expect(mockBookRepository.update).toHaveBeenCalledWith('JK-45', {
      stock: 2,
    });
    expect(mockBorrowingRecordRepository.update).toHaveBeenCalledWith(
      '1',
      expect.objectContaining({ returnedAt: expect.any(Date) }),
    );
  });
});
