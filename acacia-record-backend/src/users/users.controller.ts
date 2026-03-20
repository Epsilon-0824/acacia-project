import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAdminGuard } from 'src/auth/jwt-admin.guard';
import { UpdateProfileDto } from './dto/updateProfile.dto';

@Controller({
    version: '1',
    path: 'users'
})
export class UsersController {
    constructor(private readonly userService: UsersService){}

    @UseGuards(JwtAdminGuard)
    @Get()
    @HttpCode(201)
    findAll(){
        return this.userService.findAll()
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() UpdateProfileDto: UpdateProfileDto){
        return this.userService.update(id, UpdateProfileDto);
    }
}
