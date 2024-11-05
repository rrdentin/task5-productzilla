// src/__tests__/unit/bookService.test.ts
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { BookService } from '../../service/bookService';
import { Book } from '../../models/Book';
import { IBook } from '../../types/book';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.disconnect();
  await mongoose.connect(mongoUri);
});
beforeAll(async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(async () => {
  jest.restoreAllMocks();
  // other cleanup, if necessary
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('BookService', () => {
  let bookService: BookService;
  
  const mockBook: IBook = {
    title: 'Test Book',
    author: 'Test Author',
    year: 2024,
    isbn: '1234567890'
  };

  beforeEach(async () => {
    await Book.deleteMany({});
    bookService = new BookService();
  });

  describe('createBook', () => {
    it('should create a new book successfully', async () => {
      const result = await bookService.createBook(mockBook);
      
      expect(result).toBeDefined();
      expect(result.title).toBe(mockBook.title);
      expect(result.author).toBe(mockBook.author);
      expect(result.year).toBe(mockBook.year);
      expect(result.isbn).toBe(mockBook.isbn);
    });

    it('should throw error for duplicate ISBN', async () => {
      await bookService.createBook(mockBook);
      await expect(bookService.createBook(mockBook)).rejects.toThrow();
    });
  });

  describe('getBooks', () => {
    it('should return empty array when no books exist', async () => {
      const books = await bookService.getBooks();
      expect(books).toEqual([]);
    });

    it('should return all books', async () => {
      await bookService.createBook(mockBook);
      await bookService.createBook({
        ...mockBook,
        isbn: '0987654321',
        title: 'Another Book'
      });

      const books = await bookService.getBooks();
      expect(books).toHaveLength(2);
    });
  });

  describe('getBookById', () => {
    it('should return book by id', async () => {
      const created = await bookService.createBook(mockBook);
      const found = await bookService.getBookById(created._id.toString());
      
      expect(found).toBeDefined();
      expect(found?.title).toBe(mockBook.title);
    });

    it('should return null for non-existent id', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const book = await bookService.getBookById(fakeId);
      expect(book).toBeNull();
    });

    it('should throw error for invalid id format', async () => {
      await expect(bookService.getBookById('invalid-id')).rejects.toThrow();
    });
  });

  describe('updateBook', () => {
    it('should update book successfully', async () => {
      const created = await bookService.createBook(mockBook);
      const updateData = { title: 'Updated Title' };
      
      const updated = await bookService.updateBook(created._id.toString(), updateData);
      expect(updated).toBeDefined();
      expect(updated?.title).toBe('Updated Title');
    });

    it('should return null when updating non-existent book', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const result = await bookService.updateBook(fakeId, { title: 'New Title' });
      expect(result).toBeNull();
    });

    it('should throw error for invalid id format', async () => {
      await expect(bookService.updateBook('invalid-id', { title: 'New Title' }))
        .rejects.toThrow('Invalid ID format');
    });
  });

  describe('deleteBook', () => {
    it('should delete book successfully', async () => {
      const created = await bookService.createBook(mockBook);
      const result = await bookService.deleteBook(created._id.toString());
      
      expect(result).toBe(true);
      const found = await bookService.getBookById(created._id.toString());
      expect(found).toBeNull();
    });

    it('should return false when deleting non-existent book', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const result = await bookService.deleteBook(fakeId);
      expect(result).toBe(false);
    });

    it('should throw error for invalid id format', async () => {
      await expect(bookService.deleteBook('invalid-id'))
        .rejects.toThrow('Invalid ID format');
    });
  });

  describe('findByIsbn', () => {
    it('should find book by ISBN', async () => {
      await bookService.createBook(mockBook);
      const found = await bookService.findByIsbn(mockBook.isbn);
      
      expect(found).toBeDefined();
      expect(found?.isbn).toBe(mockBook.isbn);
    });

    it('should return null for non-existent ISBN', async () => {
      const book = await bookService.findByIsbn('9999999999');
      expect(book).toBeNull();
    });
  });

  describe('searchBooks', () => {
    beforeEach(async () => {
      await bookService.createBook(mockBook);
      await bookService.createBook({
        ...mockBook,
        title: 'Another Test Book',
        isbn: '0987654321'
      });
    });

    it('should find books by title search', async () => {
      const books = await bookService.searchBooks('Test');
      expect(books).toHaveLength(2);
    });

    it('should find books by author search', async () => {
      const books = await bookService.searchBooks('Author');
      expect(books).toHaveLength(2);
    });

    it('should find book by ISBN search', async () => {
      const books = await bookService.searchBooks('1234567890');
      expect(books).toHaveLength(1);
    });

    it('should return empty array for no matches', async () => {
      const books = await bookService.searchBooks('NonExistent');
      expect(books).toHaveLength(0);
    });
  });

  describe('findByYear', () => {
    it('should find books by year', async () => {
      await bookService.createBook(mockBook);
      const books = await bookService.findByYear(2024);
      
      expect(books.length).toBeGreaterThan(0);
      expect(books[0]?.year).toBe(2024);  // Using optional chaining
      
      // Alternative approach with more explicit checks
      const firstBook = books[0];
      expect(firstBook).toBeDefined();
      if (firstBook) {
        expect(firstBook.year).toBe(2024);
      }
    });

    it('should return empty array when no books match year', async () => {
      const books = await bookService.findByYear(1999);
      expect(books).toHaveLength(0);
    });
  });

  describe('findByAuthor', () => {
    it('should find books by author (case insensitive)', async () => {
      await bookService.createBook(mockBook);
      const books = await bookService.findByAuthor('test');
      
      expect(books.length).toBeGreaterThan(0);
      const firstBook = books[0];
      expect(firstBook).toBeDefined();
      if (firstBook) {
        expect(firstBook.author.toLowerCase()).toContain('test');
      }
    });

    it('should return empty array when no books match author', async () => {
      const books = await bookService.findByAuthor('NonExistent');
      expect(books).toHaveLength(0);
    });
  });

  describe('countBooks', () => {
    it('should return correct count of books', async () => {
      await bookService.createBook(mockBook);
      await bookService.createBook({
        ...mockBook,
        isbn: '0987654321'
      });

      const count = await bookService.countBooks();
      expect(count).toBe(2);
    });

    it('should return 0 when no books exist', async () => {
      const count = await bookService.countBooks();
      expect(count).toBe(0);
    });
  });
});