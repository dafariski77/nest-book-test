import { Test, TestingModule } from '@nestjs/testing';
import { MemberRepository } from 'src/infrastructure/repositories/member.repository';
import { BadRequestException } from '@nestjs/common';
import { MemberService } from './member.service';

describe('MemberService', () => {
  let service: MemberService;
  let repository: MemberRepository;

  const mockMemberRepository = {
    findAll: jest.fn(),
    findByCode: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberService,
        { provide: MemberRepository, useValue: mockMemberRepository },
      ],
    }).compile();

    service = module.get<MemberService>(MemberService);
    repository = module.get<MemberRepository>(MemberRepository);
  });

  it('should return all members with the number of books borrowed', async () => {
    const mockMembers = [
      {
        code: 'M001',
        name: 'Angga',
        borrowingRecord: [{ returnedAt: null }],
      },
      {
        code: 'M002',
        name: 'Ferry',
        borrowingRecord: [{ returnedAt: null }, { returnedAt: null }],
      },
    ];

    mockMemberRepository.findAll.mockResolvedValue(mockMembers);

    const result = await service.findAll();

    expect(result).toEqual([
      {
        code: 'M001',
        name: 'Angga',
        borrowingRecord: [{ returnedAt: null }],
        totalBooksBorrowed: 1,
      },
      {
        code: 'M002',
        name: 'Ferry',
        borrowingRecord: [{ returnedAt: null }, { returnedAt: null }],
        totalBooksBorrowed: 2,
      },
    ]);
  });

  it('should throw an error if member is not found by code', async () => {
    mockMemberRepository.findByCode.mockResolvedValue(null);

    await expect(service.findByCode('M999')).rejects.toThrow(
      new BadRequestException('Member tidak ditemukan'),
    );
  });

  it('should create a member successfully', async () => {
    const createMemberDto = { code: 'M004', name: 'New Member' };

    await service.create(createMemberDto);

    expect(mockMemberRepository.create).toHaveBeenCalledWith(createMemberDto);
  });
});
