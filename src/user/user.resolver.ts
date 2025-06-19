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
  users(): User[] {
    return this.userService.findAll();
  }

  @Query(() => User, { nullable: true })
  user(@Args('id') id: string): User | undefined {
    return this.userService.findOne(id);
  }
  
  @Mutation(() => LoginResponse, { nullable: true })
  login(@Args('loginInput') loginInput: LoginInput): LoginResponse | null {
    const user = this.authService.validateUser(loginInput.email);
    if (!user) return null;
    return this.authService.login(user);
  }

  @Query(() => User, { nullable: true })
    @UseGuards(JwtAuthGuard)
    me(@CurrentUser() user: any): User | undefined {
    return this.userService.findOne(user.userId);
    }
}

