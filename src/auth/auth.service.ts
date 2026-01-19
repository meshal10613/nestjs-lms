import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterUserDto } from './dto/register.user.dto';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login.user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}
    async registerUser(registerUserDto: RegisterUserDto) {
        const saltRound = 10;
        const hash = await bcrypt.hash(registerUserDto.password, saltRound);

        const user = await this.userService.createUser({
            ...registerUserDto,
            password: hash,
        });

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const token = await this.jwtService.signAsync(payload);

        return {
            access_token: token,
            user,
        };
    }

    async loginUser(loginUserDto: LoginUserDto) {
        const user = await this.userService.getUserByEmail(loginUserDto);

        const isPasswordValid = await bcrypt.compare(
            loginUserDto.password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        const token = await this.jwtService.signAsync(payload);

        return {
            access_token: token,
            user,
        };
    }
}
