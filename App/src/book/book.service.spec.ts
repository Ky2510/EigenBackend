import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { PrismaService } from 'src/prisma.service';

describe('BookService', () => {
  let service: BookService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: PrismaService,
          useValue: {
            books: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllBooks', () => {
    it('should return a list of books with stock greater than 0', async () => {
      const books = [
        {
          id: '1',
          title: 'Book 1',
          code: '001',
          stock: 1,
          author: 'Mike',
          borrowedby: null,
        },
        {
          id: '2',
          title: 'Book 2',
          code: '002',
          stock: 0,
          author: 'Ming',
          borrowedby: null,
        },
      ];
      jest.spyOn(prismaService.books, 'findMany').mockResolvedValue(books);

      expect(await service.getAllBooks()).toBe(books);
      expect(prismaService.books.findMany).toHaveBeenCalledWith({
        where: { stock: { gt: 0 } },
      });
    });

    it('should throw an error when PrismaService throws an error', async () => {
      jest
        .spyOn(prismaService.books, 'findMany')
        .mockRejectedValue(new Error('Failed to fetch books'));

      await expect(service.getAllBooks()).rejects.toThrow(
        'Failed to fetch books',
      );
    });
  });
});
