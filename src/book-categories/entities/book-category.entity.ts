import { Book } from 'src/books/book.entity';
import { Category } from 'src/categories/category.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('book-categories')
export class BookCategory {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  book_id: number;

  @Column()
  category_id: number;

  @ManyToOne(() => Category, (category) => category.id)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Book, (book) => book.id)
  @JoinColumn({ name: 'book_id' })
  book: Book;
}
