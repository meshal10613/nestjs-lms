import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserService } from './user.service';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from './user.types';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @UseGuards(AuthGuard)
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async getAllUser() {
        const result = await this.userService.getAllUser();
        return result;
    }
}
