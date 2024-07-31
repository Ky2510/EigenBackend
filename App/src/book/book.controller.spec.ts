import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { PrismaService } from '../prisma.service';

describe('BookService', () => {
  let service: BookService;
  let controller: BookController;

  beforeEach(async () => {
    const mockPrismaService = {
      book: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: '1',
            title: 'Book 1',
            code: 'Ayah',
            stock: 1,
            author: 'Abah',
            borrowedby: null,
          },
          {
            id: '2',
            title: 'Book 2',
            code: 'Ibu',
            stock: 0,
            author: 'Mayya',
            borrowedby: null,
          },
        ]),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
      controllers: [BookController],
    }).compile();

    service = module.get<BookService>(BookService);
    controller = module.get<BookController>(BookController);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
  });

  it('should return an array of books', async () => {
    const books = [
      {
        id: '1',
        title: 'Book 1',
        code: 'Ayah',
        stock: 1,
        author: 'Abah',
        borrowedby: null,
      },
      {
        id: '2',
        title: 'Book 2',
        code: 'Ibu',
        stock: 0,
        author: 'Mayya',
        borrowedby: null,
      },
    ];

    jest.spyOn(service, 'getAllBooks').mockImplementation(async () => books);

    const result = await controller.getAllBooks();
    expect(result).toEqual(books);
  });
});
