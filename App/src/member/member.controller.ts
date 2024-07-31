import { Controller, Post, Get, Body } from '@nestjs/common';
import { MemberService } from './member.service';
import { ApiBody } from '@nestjs/swagger';
import { MemberBookDto } from './dto/member.dto';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post('borrow')
  @ApiBody({ type: MemberBookDto })
  async borrowBook(@Body() memberBookDto: MemberBookDto) {
    return this.memberService.borrowBook(memberBookDto);
  }

  @Post('return')
  async returnBook(@Body() memberBookDto: MemberBookDto) {
    return this.memberService.returnBook(memberBookDto);
  }

  @Get()
  async getAllMembers() {
    return this.memberService.getAllMembers();
  }
}
