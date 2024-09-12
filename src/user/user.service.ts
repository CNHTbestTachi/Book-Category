import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt'; // Để tạo token
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { access } from 'fs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService, // Inject JwtService
  ) {}

  create(requestBody: any) {
    const user = this.userRepo.create(requestBody);
    return this.userRepo.save(user);
  }

  async register(requestBody: CreateUserDto) {
    // Check if email already exists
    const check = await this.userRepo.findOneBy({ email: requestBody.email });
    if (check != null) {
      return { message: 'Email already exists' };
    }


    const hashedPassword = await bcrypt.hash(requestBody.password, 10);
    requestBody.password = hashedPassword;

    const user = this.userRepo.create(requestBody);
    await this.userRepo.save(user);

    const payload1 = { username: user.username, sub: user.id };
    const accessToken2 = this.jwtService.sign(payload1, {
      secret: process.env.JWT_SECRET,
    });
    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password
        // Add other user fields if necessary
      },
      accessToken2,
    };
  }

  //   const checkUsername = requestBody.username;

  //   // Kiểm tra nếu username là undefined hoặc null
  //   if (!checkUsername) {
  //     return 'Username is required';
  //   }

  //   // Kiểm tra độ dài của username
  //   if (checkUsername.length < 3 || checkUsername.length > 16) {
  //     return 'Username must be between 3 and 16 characters';
  //   }

  //   // Kiểm tra xem có chứa khoảng trắng không
  //   if (checkUsername.includes(' ')) {
  //     return 'Username cannot contain spaces';
  //   }

  //   // Kiểm tra xem có chứa các ký tự không hợp lệ
  //   const regex = /^[a-zA-Z0-9_.]+$/;
  //   if (!regex.test(checkUsername)) {
  //     return 'Username can only contain letters, numbers, underscores (_) or periods (.)';
  //   }

  //   // Kiểm tra không bắt đầu hoặc kết thúc bằng dấu chấm (.) hoặc gạch dưới (_)
  //   if (
  //     checkUsername.startsWith('.') ||
  //     checkUsername.startsWith('_') ||
  //     checkUsername.endsWith('.') ||
  //     checkUsername.endsWith('_')
  //   ) {
  //     return 'Username cannot start or end with a period (.) or underscore (_)';
  //   }

  //   // Kiểm tra không có hai dấu chấm (..) hoặc gạch dưới (__) liền nhau
  //   if (checkUsername.includes('..') || checkUsername.includes('__')) {
  //     return 'Username cannot contain consecutive periods (..) or underscores (__)';
  //   }

  //   // Hash mật khẩu trước khi lưu vào database
  //   const hashedPassword = await bcrypt.hash(requestBody.password, 10);
  //   requestBody.password = hashedPassword;

  //   const user = await this.userRepo.create(requestBody);
  //   return await this.userRepo.save(user);
  // }

  async login(email: string, password: string) {
    const user = await this.userRepo.findOneBy({ email });

    if (!user) {
      return 'User not found';
    }

    // So sánh mật khẩu hash trong database với mật khẩu đã nhập
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return 'Invalid password';
    }
    // Tạo access_token nếu mật khẩu đúng
    const payload = { username: user.username, sub: user.id };
    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });

    return {
      message: 'Login success',
      access_token, // Trả về token nếu cần
    };
  }
}
