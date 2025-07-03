import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { LoginInput } from './dto/login.input';
import { AuthService } from '../auth/auth.service';
import { LoginResponse } from './dto/login-response';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from './enums/role.enum';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Query(() => [User])
  async users(): Promise<User[]> {
    const users = await this.userService.findAll();
    return users.map((user) => ({
      ...user,
      role: user.role as Role,
    }));
  }

  @Query(() => User, { nullable: true })
  async user(@Args('id') id: string): Promise<User | null> {
    const user = await this.userService.findOne(id);
    if (!user) return null;
    return {
      ...user,
      role: user.role as Role,
    };
  }

  @Mutation(() => LoginResponse, { nullable: true })
  async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<LoginResponse | null> {
    const user = await this.authService.validateUser(loginInput.email, loginInput.password,);
    if (!user) return null;
    return this.authService.login(user);
  }

  @Query(() => User, { nullable: true })
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: { userId: string }): Promise<User | null> {
    const foundUser = await this.userService.findOne(user.userId);
    if (!foundUser) return null;
    return {
      ...foundUser,
      role: foundUser.role as Role,
    };
  }
}
