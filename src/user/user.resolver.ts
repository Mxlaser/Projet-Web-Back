import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { LoginInput } from './dto/login.input';
import { AuthService } from '../auth/auth.service';
import { LoginResponse } from './dto/login-response';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Query(() => [User])
  async users(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Query(() => User, { nullable: true })
  async user(@Args('id') id: string): Promise<User | undefined> {
    return await this.userService.findOne(id);
  }
  
  @Mutation(() => LoginResponse, { nullable: true })
  async login(@Args('loginInput') loginInput: LoginInput): Promise<LoginResponse | null> {
    const user = await this.authService.validateUser(loginInput.email);
    if (!user) return null;
    return this.authService.login(user);
  }

  @Query(() => User, { nullable: true })
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: any): Promise<User | undefined> {
    return await this.userService.findOne(user.userId);
  }
}

