// src/services/bookService.ts
import mongoose from 'mongoose';
import { Book } from '../models/Book';
import { IBook } from '../types/book';
import { MongoServerError } from 'mongodb';

export class BookService {
  async createBook(bookData: IBook) {
    try {
      const book = new Book(bookData);
      const savedBook = await book.save();
      return savedBook;
    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000) {
        throw new Error('Duplicate ISBN');
      }
      console.error('Error creating book:', error); // Log only unexpected errors
      throw error; // Re-throw unexpected errors
    
    }
  }

  async getBooks() {
    try {
      const books = await Book.find()
        .sort({ createdAt: -1 })
        .lean();
      return books;
    } catch (error) {
      console.error('Error getting books:', error);
      return [];
    }
  }

  async getBookById(id: string) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ID format');
      }

      const book = await Book.findById(id).lean();
      return book;
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid ID format') {
        throw error;
      }
      console.error('Error getting book by id:', error);
      return null;
    }
  }

  async updateBook(id: string, bookData: Partial<IBook>) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ID format');
      }

      const updated = await Book.findByIdAndUpdate(
        id,
        { $set: bookData },
        { 
          new: true,
          runValidators: true,
          lean: true
        }
      );

      return updated;
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid ID format') {
        throw error;
      }
      console.error('Error updating book:', error);
      return null;
    }
  }

  async deleteBook(id: string) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ID format');
      }

      const result = await Book.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid ID format') {
        throw error;
      }
      console.error('Error deleting book:', error);
      return false;
    }
  }

  async findByIsbn(isbn: string) {
    try {
      const book = await Book.findOne({ isbn }).lean();
      return book;
    } catch (error) {
      console.error('Error finding book by ISBN:', error);
      return null;
    }
  }

  async searchBooks(query: string) {
    try {
      const books = await Book.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { author: { $regex: query, $options: 'i' } },
          { isbn: { $regex: query, $options: 'i' } }
        ]
      }).lean();
      return books;
    } catch (error) {
      console.error('Error searching books:', error);
      return [];
    }
  }

  // Additional helper methods
  async countBooks() {
    try {
      return await Book.countDocuments();
    } catch (error) {
      console.error('Error counting books:', error);
      return 0;
    }
  }

  async findByYear(year: number): Promise<IBook[]> {
    try {
      const books = await Book.find({ year }).lean();
      return books || [];
    } catch (error) {
      console.error('Error finding books by year:', error);
      return [];
    }
  }

  async findByAuthor(author: string): Promise<IBook[]> {
    try {
      const books = await Book.find({ 
        author: { $regex: author, $options: 'i' } 
      }).lean();
      return books || [];
    } catch (error) {
      console.error('Error finding books by author:', error);
      return [];
    }
  }
}