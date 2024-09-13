import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(body: SignInDto): Promise<{ access_token: string }> {
    const { username, pass } = body;
    const user = await this.usersService.findOne(username);

    const hashedPassword = await bcrypt.hash(body.pass, 10);
    body.pass = hashedPassword;

    // if (user.password !== pass) {
    //   throw new UnauthorizedException();
    // }

    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }

  async validatePayload(payload: { sub: number; username: string }) {
    try {
      return await this.usersService.userRepo.findOneOrFail({
        where: { id: payload.sub },
      });

    } catch (error) {
      throw error;
    }
  }
}
