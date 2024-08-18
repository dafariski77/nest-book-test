import { MemberEntity } from 'src/domain/member/member.entity';

export interface MemberWithBooksBorrowed extends MemberEntity {
  totalBooksBorrowed: number;
}
