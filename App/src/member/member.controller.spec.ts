import { Test, TestingModule } from '@nestjs/testing';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { MemberBookDto } from './dto/member.dto';

describe('MemberController', () => {
  let controller: MemberController;
  let service: MemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberController],
      providers: [
        {
          provide: MemberService,
          useValue: {
            borrowBook: jest.fn(),
            returnBook: jest.fn(),
            getAllMembers: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MemberController>(MemberController);
    service = module.get<MemberService>(MemberService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should borrow a book', async () => {
    const dto: MemberBookDto = {
      memberCode: 'member1',
      bookCode: 'book1',
    };

    const mockResult = { message: 'Book borrowed successfully.' };
    jest.spyOn(service, 'borrowBook').mockResolvedValue(mockResult);

    const result = await controller.borrowBook(dto);
    expect(result).toEqual(mockResult);
  });

  it('should return a book', async () => {
    const dto: MemberBookDto = {
      memberCode: 'member1',
      bookCode: 'book1',
    };

    const mockResult = { message: 'Book returned successfully.' };
    jest.spyOn(service, 'returnBook').mockResolvedValue(mockResult);

    const result = await controller.returnBook(dto);
    expect(result).toEqual(mockResult);
  });

  it('should get all members', async () => {
    const members = [
      {
        id: 'member1',
        code: 'M01',
        count: 0,
        penaltyUntil: null,
        name: 'John Doe',
      },
      {
        id: 'member2',
        code: 'M02',
        count: 0,
        penaltyUntil: null,
        name: 'Jane Smith',
      },
    ];

    jest.spyOn(service, 'getAllMembers').mockResolvedValue(members);

    const result = await controller.getAllMembers();
    expect(result).toEqual(members);
  });
});
