import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { BooksModule } from './books/books.module';
import { Book } from './books/book.entity';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/category.entity';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { BookCategoriesModule } from './book-categories/book-categories.module';
import { BookCategory } from './book-categories/entities/book-category.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'luongdao',
      username: 'postgres',
      entities: [Book, Category, User, BookCategory],
      database: 'nhap',
      synchronize: true,
      logging: true,
    }),
    BooksModule,
    CategoriesModule,
    UserModule,
    BookCategoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
