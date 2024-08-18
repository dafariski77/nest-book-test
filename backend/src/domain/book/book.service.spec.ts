import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { BookRepository } from 'src/infrastructure/repositories/book.repository';
import { BadRequestException } from '@nestjs/common';

describe('BookService', () => {
  let service: BookService;
  let repository: BookRepository;

  const mockBookRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByCode: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        { provide: BookRepository, useValue: mockBookRepository },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    repository = module.get<BookRepository>(BookRepository);
  });

  it('should return all books excluding those currently borrowed', async () => {
    mockBookRepository.findAll.mockResolvedValue([
      { code: 'JK-45', title: 'Harry Potter', stock: 1, borrowingRecord: [] },
      {
        code: 'SHR-1',
        title: 'A Study in Scarlet',
        stock: 1,
        borrowingRecord: [{ returnedAt: null }],
      },
    ]);

    const result = await service.findAll();

    expect(result).toEqual([
      { code: 'JK-45', title: 'Harry Potter', stock: 1, borrowingRecord: [] },
    ]);
  });

  it('should throw an error if book is not found by code', async () => {
    mockBookRepository.findByCode.mockResolvedValue(null);

    await expect(service.findByCode('INVALID')).rejects.toThrow(
      new BadRequestException('Book tidak ditemukan'),
    );
  });

  it('should create a book successfully', async () => {
    const createBookDto = {
      code: 'JK-45',
      author: 'J.K Rowling',
      title: 'Harry Potter',
      stock: 1,
    };

    await service.create(createBookDto);

    expect(mockBookRepository.create).toHaveBeenCalledWith(createBookDto);
  });

  it('should update a book successfully', async () => {
    const updateBookDto = { title: 'Updated Harry Potter' };

    mockBookRepository.findByCode.mockResolvedValue({ code: 'JK-45' });

    await service.update('JK-45', updateBookDto);

    expect(mockBookRepository.update).toHaveBeenCalledWith(
      'JK-45',
      updateBookDto,
    );
  });
});
