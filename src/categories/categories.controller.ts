import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('create_categories')
  async create(@Body() category: Category) {
    try {
      const newCategory = await this.categoriesService.create(category);
      return newCategory;
    } catch (error) {
      throw new HttpException(
        'Error creating category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('categories_list')
  async findAll(): Promise<Category[]> {
    try {
      return await this.categoriesService.findAll();
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

      const categoryId = parseInt(id, 10);
      if (isNaN(categoryId)) {
        throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
      }
      console.log(`Parsed ID: ${categoryId}`); // Debugging line

      const result = await this.categoriesService.delete(categoryId);
      if (!result) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'Category successfully deleted' };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
