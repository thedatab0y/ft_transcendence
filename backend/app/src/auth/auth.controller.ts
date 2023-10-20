// auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body() credentials: { intraName: string; password: string }) {
    const { intraName, password } = credentials;
    console.log('data', credentials);
    if (intraName === 'mjpro' && password === '21') {
      // Authentication successful
      return { msg: 'Login successful' };
    } else {
      // Authentication failed
      return { message: 'Login failed' };
    }
  }
}
