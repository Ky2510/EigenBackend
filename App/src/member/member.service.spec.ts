import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { MemberService } from './member.service';
import { MemberBookDto } from './dto/member.dto';

describe('MemberService', () => {
  let service: MemberService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemberService, PrismaService],
    }).compile();

    service = module.get<MemberService>(MemberService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('borrowBook', () => {
    it('should throw an error if member is not found', async () => {
      prisma.members.findUnique = jest.fn().mockResolvedValue(null);

      const memberBookDto: MemberBookDto = {
        memberCode: 'M001',
        bookCode: 'B001',
      };

      await expect(service.borrowBook(memberBookDto)).rejects.toThrow(
        new BadRequestException('Member not found!'),
      );
    });

    it('should throw an error if member is penalized', async () => {
      prisma.members.findUnique = jest.fn().mockResolvedValue({
        code: 'M001',
        penaltyUntil: new Date(new Date().getTime() + 10000),
        borrowedBooks: [],
      });

      const memberBookDto: MemberBookDto = {
        memberCode: 'M001',
        bookCode: 'B001',
      };

      await expect(service.borrowBook(memberBookDto)).rejects.toThrow(
        new BadRequestException(
          'Member is currently penalized and cannot borrow books.',
        ),
      );
    });

    it('should throw an error if member has already borrowed 2 books', async () => {
      prisma.members.findUnique = jest.fn().mockResolvedValue({
        code: 'M001',
        borrowedBooks: [{}, {}],
      });

      const memberBookDto: MemberBookDto = {
        memberCode: 'M001',
        bookCode: 'B001',
      };

      await expect(service.borrowBook(memberBookDto)).rejects.toThrow(
        new BadRequestException('Member cannot borrow more than 2 books'),
      );
    });

    it('should throw an error if book is not available', async () => {
      prisma.members.findUnique = jest.fn().mockResolvedValue({
        code: 'M001',
        borrowedBooks: [],
      });

      prisma.books.findUnique = jest.fn().mockResolvedValue({
        code: 'B001',
        stock: 0,
        borrowedby: null,
      });

      const memberBookDto: MemberBookDto = {
        memberCode: 'M001',
        bookCode: 'B001',
      };

      await expect(service.borrowBook(memberBookDto)).rejects.toThrow(
        new BadRequestException('Book is not available'),
      );
    });

    it('should successfully borrow a book', async () => {
      prisma.members.findUnique = jest.fn().mockResolvedValue({
        code: 'M001',
        borrowedBooks: [],
      });

      prisma.books.findUnique = jest.fn().mockResolvedValue({
        code: 'B001',
        stock: 1,
        borrowedby: null,
      });

      prisma.books.update = jest.fn().mockResolvedValue({});
      prisma.borrow.create = jest.fn().mockResolvedValue({});
      prisma.members.update = jest.fn().mockResolvedValue({});

      const memberBookDto: MemberBookDto = {
        memberCode: 'M001',
        bookCode: 'B001',
      };

      const result = await service.borrowBook(memberBookDto);
      expect(result).toEqual({ message: 'Successfully borrowed book' });
    });
  });

  describe('returnBook', () => {
    it('should throw an error if member is not found', async () => {
      prisma.members.findUnique = jest.fn().mockResolvedValue(null);

      const memberBookDto: MemberBookDto = {
        memberCode: 'M001',
        bookCode: 'B001',
      };

      await expect(service.returnBook(memberBookDto)).rejects.toThrow(
        new BadRequestException('Member not found'),
      );
    });

    it('should throw an error if book is not borrowed by the member', async () => {
      prisma.members.findUnique = jest.fn().mockResolvedValue({
        code: 'M001',
      });

      prisma.books.findUnique = jest.fn().mockResolvedValue({
        code: 'B001',
        borrowedby: 'M002',
      });

      const memberBookDto: MemberBookDto = {
        memberCode: 'M001',
        bookCode: 'B001',
      };

      await expect(service.returnBook(memberBookDto)).rejects.toThrow(
        new BadRequestException(
          'Book not found or not borrowed by this member ',
        ),
      );
    });

    it('should throw an error if borrow record is not found', async () => {
      prisma.members.findUnique = jest.fn().mockResolvedValue({
        code: 'M001',
      });

      prisma.books.findUnique = jest.fn().mockResolvedValue({
        code: 'B001',
        borrowedby: 'M001',
      });

      prisma.borrow.findFirst = jest.fn().mockResolvedValue(null);

      const memberBookDto: MemberBookDto = {
        memberCode: 'M001',
        bookCode: 'B001',
      };

      await expect(service.returnBook(memberBookDto)).rejects.toThrow(
        new BadRequestException('Invalid return attempt'),
      );
    });

    it('should successfully return a book without penalty', async () => {
      const borrowDate = new Date();
      borrowDate.setDate(borrowDate.getDate() - 5);

      prisma.members.findUnique = jest.fn().mockResolvedValue({
        code: 'M001',
      });

      prisma.books.findUnique = jest.fn().mockResolvedValue({
        code: 'B001',
        borrowedby: 'M001',
      });

      prisma.borrow.findFirst = jest.fn().mockResolvedValue({
        id: 1,
        borrowDate: borrowDate,
      });

      prisma.books.update = jest.fn().mockResolvedValue({});
      prisma.borrow.update = jest.fn().mockResolvedValue({});
      prisma.members.update = jest.fn().mockResolvedValue({});

      const memberBookDto: MemberBookDto = {
        memberCode: 'M001',
        bookCode: 'B001',
      };

      const result = await service.returnBook(memberBookDto);
      expect(result).toEqual({ message: 'Book returned successfully ' });
    });

    it('should successfully return a book with penalty', async () => {
      const borrowDate = new Date();
      borrowDate.setDate(borrowDate.getDate() - 10); 

      prisma.members.findUnique = jest.fn().mockResolvedValue({
        code: 'M001',
      });

      prisma.books.findUnique = jest.fn().mockResolvedValue({
        code: 'B001',
        borrowedby: 'M001',
      });

      prisma.borrow.findFirst = jest.fn().mockResolvedValue({
        id: 1,
        borrowDate: borrowDate,
      });

      prisma.books.update = jest.fn().mockResolvedValue({});
      prisma.borrow.update = jest.fn().mockResolvedValue({});
      prisma.members.update = jest.fn().mockResolvedValue({});

      const memberBookDto: MemberBookDto = {
        memberCode: 'M001',
        bookCode: 'B001',
      };

      const result = await service.returnBook(memberBookDto);
      expect(result).toEqual({ message: 'Book returned successfully ' });
    });
  });

  describe('getAllMembers', () => {
    it('should return all members', async () => {
      const members = [{ code: 'M001' }, { code: 'M002' }];
      prisma.members.findMany = jest.fn().mockResolvedValue(members);

      const result = await service.getAllMembers();
      expect(result).toBe(members);
    });
  });
});
