import { Body, Controller, Get, HttpCode, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAdminGuard } from './jwt-admin.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller({
    version: '1',
    path: 'auth'
})
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @UseGuards(JwtAdminGuard)
    @Post('register')
    @HttpCode(201)
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @HttpCode(200)
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req: any) {
        const user = await this.authService.getProfile(req.user.user_id);
        return user;
    }
}
