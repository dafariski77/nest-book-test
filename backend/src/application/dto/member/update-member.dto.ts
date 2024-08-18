import { z } from 'zod';
import { memberSchema } from 'src/domain/member/member.entity';
import { PartialType } from '@nestjs/swagger';
import { CreateMemberDtoAPI } from './create-member.dto';

const updateMemberDto = memberSchema.partial().omit({
  id: true,
  borrowingRecord: true,
  createdAt: true,
  updatedAt: true,
});

export type UpdateMemberDto = z.infer<typeof updateMemberDto>;
