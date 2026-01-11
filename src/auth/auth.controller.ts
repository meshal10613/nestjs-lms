import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/registerUserDto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(@Body() registerUserDto: RegisterDto) {
        //? Dto -> Data Transfer Object
        const result = this.authService.registerUser(registerUserDto);
        return result;
    }
}
