import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './services/auth.service';
import {
  UserSignupRequest,
  UserSignupResponse,
  UserSigninRequest,
  UserSigninResponse,
} from './models/user.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @ApiOkResponse({
    description: 'Usuário encontrado',
    type: UserSigninResponse,
  })
  async signin(@Body() body: UserSigninRequest): Promise<UserSigninResponse> {
    return await this.authService.signin(body);
  }

  @Post('signup')
  @ApiCreatedResponse({
    description: 'Usuário criado',
    type: UserSignupResponse,
  })
  async signup(@Body() body: UserSignupRequest): Promise<UserSignupResponse> {
    return await this.authService.signup(body);
  }
}
