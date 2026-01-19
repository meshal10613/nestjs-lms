import {
    Controller,
    Delete,
    Get,
    Param,
    Request,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserService } from './user.service';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from './user.types';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.Admin)
    async getAllUser() {
        const result = await this.userService.getAllUser();
        return result;
    }

    @Delete(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.Admin, UserRole.Student)
    async deleteUserById(@Request() req, @Param('id') id: string) {
        return this.userService.deleteUserById(req.user, id);
    }
}
