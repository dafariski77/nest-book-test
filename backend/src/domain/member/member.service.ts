import { BadRequestException, Injectable } from '@nestjs/common';
import { MemberRepository } from 'src/infrastructure/repositories/member.repository';
import { Member } from './member.entity';
import { MemberWithBooksBorrowed } from 'src/application/interfaces/member-with-book.interface';
import { CreateMemberDto } from 'src/application/dto/member/create-member.dto';

@Injectable()
export class MemberService {
  constructor(private readonly memberRepository: MemberRepository) {}

  async findAll(): Promise<MemberWithBooksBorrowed[]> {
    const members = await this.memberRepository.findAll();

    return members?.map((member) => {
      const totalBooksBorrowed =
        member.borrowingRecord?.filter((record) => record.returnedAt === null)
          .length || 0;

      return {
        ...member,
        totalBooksBorrowed,
      };
    });
  }

  async findByCode(code: string): Promise<Member> {
    const member = await this.memberRepository.findByCode(code);

    if (!member) {
      throw new BadRequestException('Member tidak ditemukan');
    }

    return member;
  }

  async create(createMemberDto: CreateMemberDto): Promise<void> {
    await this.memberRepository.create(createMemberDto);

    return;
  }
}
