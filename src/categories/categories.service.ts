import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}
  
  async create(category: Category): Promise<Category> {
    const existingCategory = await this.categoriesRepository.findOne({
      where: { category_name: category.category_name },
    });

    if (existingCategory) {
      throw new Error('Danh mục đã tồn tại');
    }
    return this.categoriesRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  async delete(id: number): Promise<Category[]> {
    const result = await this.categoriesRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Return the remaining categories after deletion
    return this.categoriesRepository.find();
  }
}
