import { PrismaClient } from '@prisma/client';
import { error } from 'console';

const prisma = new PrismaClient();

const books = [
  {
    code: 'JK-45',
    title: 'Harry Potter',
    author: 'J.K Rowling',
    stock: 1
  },
  {
    code: 'SHR-1',
    title: 'A Study in Scarlet',
    author: 'Arthur Conan Doyle',
    stock: 1
  },
  {
    code: 'TW-11',
    title: 'Twilight',
    author: 'Stephenie Meyer',
    stock: 1
  },
  {
    code: 'HOB-83',
    title: 'The Hobbit, or There and Back Again',
    author: 'J.R.R. Tolkien',
    stock: 1
  },
  {
    code: 'NRN-7',
    title: 'The Lion, the Witch and the Wardrobe',
    author: 'C.S. Lewis',
    stock: 1
  },
];

const members = [
  {
    code: 'M001',
    name: 'Angga',
  },
  {
    code: 'M002',
    name: 'Ferry',
  },
  {
    code: 'M003',
    name: 'Putri',
  },
];

async function main() {
  await prisma.books.createMany({
    data: books,
  });

  await prisma.members.createMany({
    data: members,
  });
}

main()
    .then(() => {
        console.log('Data seeded succesfully');
    })
    .catch((error) => {
        console.log('Failed seed data');
    })
    .finally(async() => {
        await prisma.$disconnect();
    })
