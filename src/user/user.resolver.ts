import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { LoginInput } from './dto/login.input';
import { AuthService } from '../auth/auth.service';
import { LoginResponse } from './dto/login-response';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
// import { Role } from './enums/role.enum';
import { Role } from '@prisma/client';
import { CreateUserInput } from './dto/create-user.input';

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
      role: user.role,
    }));
  }

  @Query(() => User, { nullable: true })
  async user(@Args('id') id: string): Promise<User | null> {
    const user = await this.userService.findOne(id);
    if (!user) return null;
    return {
      ...user,
      role: user.role,
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

  @Mutation(() => User)
  async register(@Args('createUserInput') createUserInput: CreateUserInput): Promise<User> {
    return this.userService.create(createUserInput);
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
