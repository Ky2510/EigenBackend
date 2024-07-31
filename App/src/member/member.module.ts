import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [MemberController],
  providers: [MemberService, PrismaService],
})
export class MemberModule {}
