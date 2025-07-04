import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { Role } from '../user/enums/role.enum';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async validateUser(email: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (!user) return null;

    return {
      ...user,
      role: user.role as Role,
      createdAt: user.createdAt.toISOString(),
    };
  }

  login(user: User): { access_token: string } {
    const payload = { sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
