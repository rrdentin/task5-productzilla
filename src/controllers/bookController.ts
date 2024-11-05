import { Request, Response } from 'express';
import { BookService } from '../service/bookService';

export class BookController {
  private bookService: BookService;

  constructor() {
    this.bookService = new BookService();
  }

  getBooks = async (_: Request, res: Response): Promise<void> => {
    try {
      const books = await this.bookService.getBooks();
      res.status(200).json({
        success: true,
        data: books
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  };

  getBookById = async (req: Request, res: Response): Promise<void> => {
    try {
      const bookId = req.params.id;
      if (!bookId) {
        res.status(400).json({
          success: false,
          error: 'Book ID is required'
        });
        return;
      }
      const book = await this.bookService.getBookById(bookId);
      if (!book) {
        res.status(404).json({
          success: false,
          error: 'Book not found'
        });
        return;
      }
      res.status(200).json({
        success: true,
        data: book
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  };

  createBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const book = await this.bookService.createBook(req.body);
      res.status(201).json({
        success: true,
        data: book
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  };

  updateBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const bookId = req.params.id;
      if (!bookId) {
        res.status(400).json({
          success: false,
          error: 'Book ID is required'
        });
        return;
      }
      const updatedBook = await this.bookService.updateBook(bookId, req.body);
      if (!updatedBook) {
        res.status(404).json({
          success: false,
          error: 'Book not found'
        });
        return;
      }
      res.status(200).json({
        success: true,
        data: updatedBook
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  };

  deleteBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const bookId = req.params.id;
      if (!bookId) {
        res.status(400).json({
          success: false,
          error: 'Book ID is required'
        });
        return;
      }
      const deleted = await this.bookService.deleteBook(bookId);
      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Book not found'
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: 'Book deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  };
}