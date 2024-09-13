import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Current = createParamDecorator(
  (data: 'user' | 'admin', ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request[data];
  },
);
