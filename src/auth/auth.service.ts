import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/registerUserDto';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {}
    registerUser(registerUserDto: RegisterDto) {
        console.log(registerUserDto);
        return this.userService.createUser();
    }
}
