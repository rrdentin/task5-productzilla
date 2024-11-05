import { Document, Types } from 'mongoose';

export interface IBook {
    title: string
    author: string
    year: number
    isbn: string
    createdAt?: Date
    updatedAt?: Date
}

export interface IBookDocument extends IBook, Document {
    _id: Types.ObjectId;
}