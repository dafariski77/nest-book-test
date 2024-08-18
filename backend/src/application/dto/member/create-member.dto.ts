import { z } from 'zod';
import { memberSchema } from 'src/domain/member/member.entity';
import { ApiProperty } from '@nestjs/swagger';

const createMemberDto = memberSchema.omit({
  id: true,
  penaltyExpireAt: true,
  borrowingRecord: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateMemberDto = z.infer<typeof createMemberDto>;

export class CreateMemberDtoAPI {
  @ApiProperty({
    description: 'Kode member',
    type: String,
    example: 'M001',
    required: true,
  })
  code: string;

  @ApiProperty({
    description: 'Nama member',
    type: String,
    example: 'Angga',
    required: true,
  })
  name: string;
}
