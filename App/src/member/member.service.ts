import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { MemberBookDto } from './dto/member.dto';

@Injectable()
export class MemberService {
  constructor(private prisma: PrismaService) {}

  async borrowBook(memberBookDto: MemberBookDto) {
    const member = await this.prisma.members.findUnique({
      where: { code: memberBookDto.memberCode },
      include: { borrowedBooks: true },
    });

    if (!member) {
      throw new BadRequestException('Member not found!');
    }

    if (member.penaltyUntil && new Date(member.penaltyUntil) > new Date()) {
      throw new BadRequestException(
        'Member is currently penalized and cannot borrow books.',
      );
    }

    if (member.borrowedBooks.length >= 2) {
      throw new BadRequestException('Member cannot borrow more than 2 books');
    }

    const book = await this.prisma.books.findUnique({
      where: { code: memberBookDto.bookCode },
    });

    if (!book || book.stock <= 0 || book.borrowedby) {
      throw new BadRequestException('Book is not available');
    }

    await this.prisma.books.update({
      where: { code: memberBookDto.bookCode },
      data: {
        stock: { decrement: 1 },
        borrowedby: member.code,
      },
    });

    await this.prisma.borrow.create({
      data: {
        memberCode: member.code,
        bookCode: book.code,
      },
    });

    await this.prisma.members.update({
      where: { code: memberBookDto.memberCode },
      data: {
        count: { increment: 1 },
      },
    });

    return { message: 'Successfully borrowed book' };
  }

  async returnBook(memberBookDto: MemberBookDto) {
    const member = await this.prisma.members.findUnique({
      where: { code: memberBookDto.memberCode },
    });

    if (!member) {
      throw new BadRequestException('Member not found');
    }

    const book = await this.prisma.books.findUnique({
      where: { code: memberBookDto.bookCode },
    });

    if (!book || book.borrowedby !== member.code) {
      throw new BadRequestException(
        'Book not found or not borrowed by this member ',
      );
    }

    const borrow = await this.prisma.borrow.findFirst({
      where: {
        memberCode: member.code,
        bookCode: book.code,
        returnDate: null,
      },
    });

    if (!borrow) {
      throw new BadRequestException('Invalid return attempt');
    }

    const borrowDate = new Date(borrow.borrowDate);
    const currentDate = new Date();
    const penalty =
      currentDate.getTime() - borrowDate.getTime() > 7 * 24 * 60 * 60 * 1000;

    await this.prisma.books.update({
      where: { code: memberBookDto.bookCode },
      data: {
        stock: { increment: 1 },
        borrowedby: null,
      },
    });

    await this.prisma.borrow.update({
      where: { id: borrow.id },
      data: {
        returnDate: currentDate,
      },
    });

    if (penalty) {
      const penaltyUntil = new Date(
        currentDate.getTime() + 3 * 24 * 60 * 60 * 1000,
      );
      await this.prisma.members.update({
        where: { code: memberBookDto.memberCode },
        data: { penaltyUntil: penaltyUntil },
      });
    }

    await this.prisma.members.update({
      where: { code: memberBookDto.memberCode },
      data: { count: { decrement: 1 } },
    });

    return { message: 'Book returned successfully ' };
  }

  async getAllMembers() {
    return this.prisma.members.findMany();
  }
}
