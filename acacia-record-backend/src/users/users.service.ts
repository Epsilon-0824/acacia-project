import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/shared/db/prisma/prisma.service';
import { Users } from '@prisma/client'
import { UpdateProfileDto } from './dto/updateProfile.dto';
import { hash, compare } from 'bcrypt';
import { use } from 'passport';

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService){}

    async findAll(): Promise<Omit<Users, 'password' | 'createdAt'>[]>{
        const users = await this.prismaService.users.findMany({
            orderBy: { id: 'asc'},
            select: {
                id: true,
                username: true,
                name: true,
                permission: true
            }
        });
        return users;
    }

    async update(id: number, dto: UpdateProfileDto) {
        const user = await this.prismaService.users.findUnique({
            where: { id: id }
        });

        if (!user) throw new NotFoundException('ไม่พบผู้ใช้');

        const updateData: any = {
            name: dto.name,
            username: dto.username,
        };
        if (dto.password) {
            updateData.password = await hash(dto.password, 10);
        }

        return await this.prismaService.users.update({
            where: { id: id },
            data: updateData,
            select: {
            id: true,
            username: true,
            name: true,
            permission: true,
            }
        });
    }
}
