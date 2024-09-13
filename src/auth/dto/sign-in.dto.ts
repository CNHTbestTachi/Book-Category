import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: 'luongdao' })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  username: string;


  @ApiProperty({ example: 'luongdao' })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @Length(8, 32)
  pass: string;
}
