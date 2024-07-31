import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}

  async getAllBooks() {
    try {
      return await this.prisma.books.findMany({
        where: { stock: { gt: 0 } },
      });
    } catch (error) {
      throw new Error('Failed to fetch books');
    }
  }
}
