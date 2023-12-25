import { Controller, Get, Request, Post, UseGuards, HttpStatus } from '@nestjs/common';
import { LocalAuthGuard, AuthService, JwtAuthGuard } from './auth';

@Controller()
export class AppController {

  constructor(private authService: AuthService) {}

  @Get([ '', 'ping' ])
  healthCheck(): any {
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    };
  }

  @Post('api/auth/login')
  async login(@Request() req) {
    const token = await this.authService.login(req.body, 'jwt');

    return  {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: {
        ...token,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/profile')
  async getProfile(@Request() req) {
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: {
        user: req.user,
      },
    };
  }
}
