import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './book.entity';
import { CreateBookCategoryDto } from 'src/book-categories/dto/create-book-category.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post('create_books')
  async create(@Body() book: Book) {
    try {
      return await this.booksService.create(book);
    } catch (error) {
      throw new HttpException(
        'Failed to create book',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':bookId/add-categories')
  async addCategories(
    @Body() body: CreateBookCategoryDto,
    @Param('bookId') bookId: number,
  ) {
    try {
      return await this.booksService.addCategories(+bookId, body);
    } catch (error) {
      console.log('🚀 ~ BooksController ~ error:', error, new Date());
      throw new HttpException(
        'Failed to create book',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // @Get('book_id')
  // async findone(@Param('id') id: number): Promise<Book> {
  //   try {
  //     const book = await this.booksService.findone(id);
  //     if (!book) {
  //       throw new NotFoundException(`Book with ID ${id} not found`);
  //     }
  //     return book;
  //   } catch (error) {
  //     // Nếu có lỗi từ service hoặc bất kỳ lỗi nào khác, ném lỗi 500
  //     throw new InternalServerErrorException(
  //       'An error occurred while fetching the book',
  //     );
  //   }
  // }

  @Get('books_list')
  async findAll(): Promise<Book[]> {
    try {
      return await this.booksService.findAll();
    } catch (error) {
      throw new HttpException(
        'Error fetching books',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      console.log(`Received ID: ${id}`); // Debugging line

      const bookId = parseInt(id, 10);
      if (isNaN(bookId)) {
        throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
      }
      console.log(`Parsed ID: ${bookId}`); // Debugging line

      const result = await this.booksService.delete(bookId);
      if (!result) {
        throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'Book successfully deleted' };
    } catch (error) {
      console.error('Error deleting book:', error); // Enhanced error logging
      throw new HttpException(
        error.message || 'Failed to delete book',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
