import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Book } from './book.entity';
import { BookCategory } from 'src/book-categories/entities/book-category.entity';
import { CreateBookCategoryDto } from 'src/book-categories/dto/create-book-category.dto';
import { Category } from 'src/categories/category.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    @InjectRepository(BookCategory)
    private bookCategoryRepository: Repository<BookCategory>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(book: Book): Promise<Book> {
    return this.booksRepository.save(book);
  }

  async findAll(): Promise<Book[]> {
    return this.booksRepository.find();
  }

  async delete(id: number): Promise<Book[]> {
    const result = await this.booksRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    // Return the remaining categories after deletion
    return this.booksRepository.find();
  }

  async addCategories(bookId: number, body: CreateBookCategoryDto) {
    try {
      /**Validate categories */
      const { categories } = body;
      const arrCategories = await this.categoryRepository.find({
        where: { id: In(categories) },
      });

      const new_category_ids = arrCategories.map((c) => {
        return c.id;
      });

      /**Validate book */
      const book = await this.booksRepository.findOne({
        where: { id: bookId },
      });
      if (!book) {
        throw new NotFoundException(`Book with ID ${bookId} not found`);
      }
      const bookCategories = await this.bookCategoryRepository.find({
        where: { book_id: bookId },
        select: ['category_id'],
      });
      const category_ids = bookCategories.map((c) => {
        return c.category_id;
      });

      const c = [];
      const result = [];

      for (let i = 0; i < category_ids.length; i++) {
        c[category_ids[i]] = true;
      }

      for (let i = 0; i < new_category_ids.length; i++) {
        if (c[new_category_ids[i]] == undefined)
          result.push(new_category_ids[i]);
      }
      console.log('🚀 ~ BooksService ~ c:', result);
      return this.bookCategoryRepository.save(
        result.map((category_id) => {
          return { book_id: bookId, category_id };
        }),
      );
    } catch (error) {
      throw error;
    }
  }
}
