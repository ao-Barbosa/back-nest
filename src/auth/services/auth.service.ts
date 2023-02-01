import { compareSync, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../models/user.entity';

import {
  UserSignupRequest,
  UserSignupResponse,
  UserSigninRequest,
  UserSigninResponse,
} from '../models/user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger();

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(user: UserSignupRequest): Promise<UserSignupResponse> {
    const found = await this.userRepository.findOne({
      where: { email: user.email },
    });

    if (!!found) {
      throw new HttpException('Usuário já cadastrado', HttpStatus.CONFLICT);
    }

    const pwd = await hash(user.password, 8);
    if (!pwd || user.password.length < 8) {
      throw new HttpException(
        'Senha inválida',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    } else {
      user.password = pwd;
    }

    const created = await this.userRepository.save(user);

    const token = this.jwtService.sign({
      sub: created._id?.toString(),
      name: created.name,
    });

    const response = new UserSignupResponse({
      _id: created._id,
      name: created.name,
      token: token,
    });

    return response;
  }

  async signin(user: UserSigninRequest): Promise<UserSigninResponse> {
    const found = await this.userRepository.findOne({
      where: { email: user.email },
    });

    if (!found) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    if (!compareSync(user.password, found.password)) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    const token = this.jwtService.sign({
      sub: found._id?.toString(),
      name: found.name,
    });

    const response = new UserSignupResponse({
      _id: found._id,
      name: found.name,
      token: token,
    });

    return response;
  }
}
