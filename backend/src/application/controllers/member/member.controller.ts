import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiTags,
  ApiResponse as SwaggerApiResponse,
} from '@nestjs/swagger';
import {
  CreateMemberDto,
  CreateMemberDtoAPI,
} from 'src/application/dto/member/create-member.dto';
import { IAPIResponse } from 'src/application/interfaces/api-response.interface';
import { MemberWithBooksBorrowed } from 'src/application/interfaces/member-with-book.interface';
import { ZodPipe } from 'src/application/pipes/zod-validation.pipe';
import { ApiResponse } from 'src/application/utils/api-response';
import { MemberEntity, memberSchema } from 'src/domain/member/member.entity';
import { MemberService } from 'src/domain/member/member.service';

@ApiTags('members')
@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @HttpCode(200)
  @ApiOperation({ summary: 'Get semua data member' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Member ditemukan',
  })
  @Get()
  async findAll(): Promise<IAPIResponse<MemberWithBooksBorrowed[]>> {
    const members = await this.memberService.findAll();

    return ApiResponse.success('Berhasil mendapatkan data member', members);
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Get single data member' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Member ditemukan',
  })
  @SwaggerApiResponse({
    status: 400,
    description: 'Member tidak ditemukan',
  })
  @Get(':code')
  async findOne(
    @Param('code') code: string,
  ): Promise<IAPIResponse<MemberEntity>> {
    const member = await this.memberService.findByCode(code);

    return ApiResponse.success('Berhasil mendapatkan data member', member);
  }

  @HttpCode(201)
  @ApiOperation({ summary: 'Tambah data member' })
  @SwaggerApiResponse({
    status: 201,
    description: 'Member berhasil ditambahkan',
  })
  @SwaggerApiResponse({
    status: 400,
    description: 'Validation Error',
  })
  @ApiBody({ type: CreateMemberDtoAPI })
  @UsePipes(new ZodPipe(memberSchema))
  @Post()
  async create(@Body() createMemberDto: CreateMemberDto) {
    await this.memberService.create(createMemberDto);

    return ApiResponse.success('Berhasil membuat member baru');
  }
}
