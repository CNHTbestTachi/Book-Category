import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {  ClientAuthGuard } from './guards/auth.guard';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SignInDto } from './dto/sign-in.dto';
import { Current } from 'src/decorators/current.decorator';
import { User } from 'src/user/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body);
  }

  @ApiBearerAuth()
  @UseGuards(ClientAuthGuard)
  @Get('profile')
  getProfile(@Current('user') user: User) {
    return user;
  }
}
