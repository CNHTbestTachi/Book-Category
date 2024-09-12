import { IsString, IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(4, 20, {
    message: 'Username must be between 4 and 20 characters long',
  })
  username: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsString()
  @Length(6, 20, {
    message: 'Password must be between 6 and 20 characters long',
  })
  password: string;
}
