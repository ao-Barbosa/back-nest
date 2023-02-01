import { createParamDecorator } from '@nestjs/common';

export const AuthUserId = createParamDecorator((data, req) => {
  return req.args[1].req.user.userId;
});

export const AuthUser = createParamDecorator((data, req) => {
  return req.args[1].req.user;
});
