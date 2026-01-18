import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/registerUserDto';
import { LoginDto } from './dto/loginUserDto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() registerUserDto: RegisterDto) {
        //? Dto -> Data Transfer Object
        const result = await this.authService.registerUser(registerUserDto);
        return result;
    }

    @Post('login')
    async login(@Body() loginUserDto: LoginDto) {
        const result = await this.authService.loginUser(loginUserDto);
        return result;
    }
}
