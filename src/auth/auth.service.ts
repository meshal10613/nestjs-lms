import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/registerUserDto';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/loginUserDto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}
    async registerUser(registerUserDto: RegisterDto) {
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

        return { access_token: token };
    }

    async loginUser(loginUserDto: LoginDto) {
        const user = await this.userService.findUser(loginUserDto);

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
        };
    }
}
