import mongoose, { Schema } from 'mongoose';
import { IBookDocument } from '../types/book';

const BookSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1000, 'Year must be after 1000'],
    max: [new Date().getFullYear(), 'Year cannot be in the future']
  },
  isbn: {
    type: String,
    required: [true, 'ISBN is required'],
    unique: true,
    validate: {
      validator: function(v: string) {
        return /^(?:\d{10}|\d{13})$/.test(v);
      },
    }
  }
}, {
  timestamps: true
});

export const Book = mongoose.model<IBookDocument>('Book', BookSchema);