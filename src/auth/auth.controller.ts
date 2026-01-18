import {
    Body,
    Controller,
    Get,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/registerUserDto';
import { LoginDto } from './dto/loginUserDto';
import { AuthGuard } from './auth.guard';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

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

    @UseGuards(AuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
        const userId = req.user.sub;
        const user = await this.userService.getUserById(userId as string);
        console.log(user);
        return user;
    }
}
