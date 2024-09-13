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
    @InjectRepository(User) public userRepo: Repository<User>,
    public jwtService: JwtService, // Inject JwtService
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
  async findOne(username: string): Promise<User | undefined> {
    try {
      return await this.userRepo.findOne({ where: { username } });
    } catch (error) {
      console.error('Error finding user:', error);
      throw new Error('Could not find user');
    }
  }
  
}
