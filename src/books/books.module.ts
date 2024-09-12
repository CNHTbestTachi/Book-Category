import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { BookCategory } from 'src/book-categories/entities/book-category.entity';
import { Category } from 'src/categories/category.entity';


@Module({
  imports:[TypeOrmModule.forFeature([Book, BookCategory, Category])],
  providers: [BooksService],
  controllers: [BooksController]
})
export class BooksModule {}
