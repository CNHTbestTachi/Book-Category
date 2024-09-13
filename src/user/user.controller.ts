import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
// import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto'; // Thêm DTO cho login

// @ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  // @Post()
  // createUser(@Body() requestBody: CreateUserDto) {
  //   return this.userService.create(requestBody);
  // }

  @Post('register')
  async registerUser(@Body() requestBody: CreateUserDto) {
    try {
      return await this.userService.register(requestBody);
    } catch (error) {
      throw new HttpException(
        { message: 'Registration failed', error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('login')
  async loginUser(@Body() requestBody: LoginUserDto) {
    try {
      const { email, password } = requestBody;
      return await this.userService.login(email, password);
    } catch (error) {
      throw new HttpException(
        { message: 'Login failed', error: error.message },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
