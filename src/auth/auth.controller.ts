import {
    Body,
    Controller,
    Get,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.user.dto';
import { LoginUserDto } from './dto/login.user.dto';
import { AuthGuard } from './auth.guard';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

    @Post('register')
    async register(@Body() registerUserDto: RegisterUserDto) {
        //? Dto -> Data Transfer Object
        const result = await this.authService.registerUser(registerUserDto);
        return result;
    }

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto) {
        const result = await this.authService.loginUser(loginUserDto);
        return result;
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
        const userId = req.user.sub;
        const user = await this.userService.getUserById(userId as string);
        return user;
    }
}
