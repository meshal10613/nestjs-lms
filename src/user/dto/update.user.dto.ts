import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { RegisterUserDto } from 'src/auth/dto/register.user.dto';
import { UserRole } from '../user.types';

export class UpdateUserDto extends PartialType(RegisterUserDto) {
    @IsOptional()
    @IsEnum(UserRole, { message: 'role must be a valid UserRole' })
    role?: UserRole;
}
