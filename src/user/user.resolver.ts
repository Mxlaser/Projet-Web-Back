import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from '../auth/auth.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LoginResponse } from './dto/login-response';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { User } from './entities/user.entity';
import { Role } from './enums/role.enum';
import { UserService } from './user.service';

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
      createdAt: user.createdAt.toISOString(),
    }));
  }

  @Query(() => User, { nullable: true })
  async user(@Args('id') id: string): Promise<User | null> {
    const user = await this.userService.findOne(id);
    if (!user) return null;
    return {
      ...user,
      role: user.role as Role,
      createdAt: user.createdAt.toISOString(),
    };
  }

  @Mutation(() => LoginResponse)
  async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<LoginResponse> {
    const user = await this.authService.validateUser(loginInput.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const { access_token } = this.authService.login(user);

    // Récupérer l'utilisateur complet depuis Prisma
    const fullUser = await this.userService.findByEmail(user.email);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role as Role,
        createdAt:
          fullUser?.createdAt.toISOString() || new Date().toISOString(),
      },
    };
  }

  @Mutation(() => LoginResponse)
  async register(
    @Args('registerInput') registerInput: RegisterInput,
  ): Promise<LoginResponse> {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.userService.findByEmail(
      registerInput.email,
    );
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Créer le nouvel utilisateur
    const newUser = await this.userService.create({
      email: registerInput.email,
      password: registerInput.password,
      fullName: registerInput.fullName,
      role: Role.USER,
    });

    // Convertir pour le service d'auth
    const authUser = {
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      role: newUser.role as Role,
      createdAt: newUser.createdAt.toISOString(),
    };

    const { access_token } = this.authService.login(authUser);

    return {
      access_token,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role as Role,
        createdAt: newUser.createdAt.toISOString(),
      },
    };
  }

  @Mutation(() => User)
  async register(@Args('createUserInput') createUserInput: CreateUserInput): Promise<User> {
    return this.userService.create(createUserInput);
  }

  @Query(() => User, { nullable: true })
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: { userId: string }): Promise<User | null> {
    if (!user || !user.userId) {
      throw new Error('Invalid user context');
    }

    const foundUser = await this.userService.findOne(user.userId);
    if (!foundUser) return null;
    return {
      ...foundUser,
      role: foundUser.role as Role,
      createdAt: foundUser.createdAt.toISOString(),
    };
  }
}
