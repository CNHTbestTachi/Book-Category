import { ApiProperty } from '@nestjs/swagger';

export class CreateBookCategoryDto {
  @ApiProperty({ example: [] })
  categories: number[];
}
