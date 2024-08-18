import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MemberEntity } from 'src/domain/member/member.entity';
import { CreateMemberDto } from 'src/application/dto/member/create-member.dto';
import { UpdateMemberDto } from 'src/application/dto/member/update-member.dto';

@Injectable()
export class MemberRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<MemberEntity[]> {
    const members = await this.prisma.member.findMany({
      include: {
        borrowingRecord: {
          include: {
            book: true,
          },
        },
      },
    });

    return members.map((member) => new MemberEntity(member));
  }

  async findById(id: string): Promise<MemberEntity | null> {
    const member = await this.prisma.member.findFirst({
      where: {
        id,
      },
    });

    return member ? new MemberEntity(member) : null;
  }

  async findByCode(code: string): Promise<MemberEntity | null> {
    const member = await this.prisma.member.findFirst({
      where: {
        code,
      },
    });

    return member ? new MemberEntity(member) : null;
  }

  async create(createMemberDto: CreateMemberDto): Promise<void> {
    await this.prisma.member.create({
      data: createMemberDto,
    });

    return;
  }

  async update(id: string, updateMemberDto: UpdateMemberDto): Promise<void> {
    await this.prisma.member.update({
      where: {
        id,
      },
      data: updateMemberDto,
    });

    return;
  }
}
