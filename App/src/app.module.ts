import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { BookModule } from './book/book.module';
import { MemberModule } from './member/member.module';
import { MemberService } from './member/member.service';
import { BookService } from './book/book.service';

@Module({
  imports: [BookModule, MemberModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, MemberService, BookService],
})
export class AppModule {}
