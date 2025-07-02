import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Role } from '../user/enums/role.enum';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

interface LoginDto {
  email: string;
  password: string;
}

interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
}

interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: Role;
    createdAt: string;
  };
}

interface AuthenticatedRequest {
  user: {
    userId: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.authService.validateUser(loginDto.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const { access_token } = this.authService.login(user);

    // Récupérer l'utilisateur complet depuis Prisma pour avoir createdAt
    const fullUser = await this.userService.findByEmail(user.email);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        createdAt:
          fullUser?.createdAt.toISOString() || new Date().toISOString(),
      },
    };
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Créer le nouvel utilisateur
    const newUser = await this.userService.create({
      email: registerDto.email,
      password: registerDto.password, // Note: le service devrait hasher le mot de passe
      fullName: registerDto.fullName,
      role: Role.USER,
    });

    // Convertir pour le service d'auth
    const authUser = {
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      role: newUser.role as Role,
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

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(
    @Request() req: AuthenticatedRequest,
  ): Promise<AuthResponse['user']> {
    const user = await this.userService.findOne(req.user.userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role as Role,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
