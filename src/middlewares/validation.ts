// src/middlewares/validation.ts
import { Request, Response, NextFunction } from 'express';
import { IBook } from '../types/book';

export const validateBook = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { title, author, year, isbn }: IBook = req.body;
    const errors: string[] = [];

    // Validasi title
    if (!title || title.trim().length === 0) {
      errors.push('Title is required');
    }

    // Validasi author
    if (!author || author.trim().length === 0) {
      errors.push('Author is required');
    }

    // Validasi year
    const currentYear = new Date().getFullYear();
    if (!year || isNaN(year) || year < 1000 || year > currentYear) {
      errors.push(`Year must be between 1000 and ${currentYear}`);
    }

    // Validasi ISBN
    if (!isbn || !/^(?:\d{10}|\d{13})$/.test(isbn)) {
      errors.push('ISBN must be 10 or 13 digits');
    }

    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        errors
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Validation error occurred'
    });
  }
};

// Custom types untuk memperjelas request body
export interface BookRequest extends Request {
  body: IBook;
}

// Validation untuk update (partial data)
export const validatePartialBook = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { title, author, year, isbn }: Partial<IBook> = req.body;
    const errors: string[] = [];

    // Validasi title jika ada
    if (title !== undefined && title.trim().length === 0) {
      errors.push('Title cannot be empty');
    }

    // Validasi author jika ada
    if (author !== undefined && author.trim().length === 0) {
      errors.push('Author cannot be empty');
    }

    // Validasi year jika ada
    if (year !== undefined) {
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1000 || year > currentYear) {
        errors.push(`Year must be between 1000 and ${currentYear}`);
      }
    }

    // Validasi ISBN jika ada
    if (isbn !== undefined && !/^(?:\d{10}|\d{13})$/.test(isbn)) {
      errors.push('ISBN must be 10 or 13 digits');
    }

    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        errors
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Validation error occurred'
    });
  }
};