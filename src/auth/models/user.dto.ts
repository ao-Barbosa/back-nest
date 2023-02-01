import { ApiProperty } from '@nestjs/swagger';

interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  token: string;
}

export class UserSigninRequest {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;

  constructor({ email, password }: Pick<User, 'email' | 'password'>) {
    this.email = email;
    this.password = password;
  }
}

export class UserSigninResponse {
  @ApiProperty()
  _id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  token: string;

  constructor({ _id, name, token }: Pick<User, '_id' | 'name' | 'token'>) {
    this._id = _id;
    this.name = name;
    this.token = token;
  }
}

export class UserSignupRequest {
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;

  constructor({
    name,
    email,
    password,
  }: Pick<User, 'name' | 'email' | 'password'>) {
    this.name = name;
    this.email = email;
    this.password = password;
  }
}

export class UserSignupResponse {
  @ApiProperty()
  _id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  token: string;

  constructor({ _id, name, token }: Pick<User, '_id' | 'name' | 'token'>) {
    this._id = _id;
    this.name = name;
    this.token = token;
  }
}
