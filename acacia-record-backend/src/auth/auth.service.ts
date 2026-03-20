import { ConflictException, HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { hash, genSalt, compare } from 'bcrypt'
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/shared/db/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private jwtService: JwtService
    ){}

    async register(registerDto: RegisterDto){
        try {
            const salt = await genSalt(10);
            const hashPassword = await hash(registerDto.password, salt);

            const newUser = await this.prismaService.users.create({
                data: {
                    name: registerDto.name,
                    username: registerDto.username,
                    password: hashPassword,
                    permission: registerDto.permission
                }
            });
            return newUser;
        } catch (error) {
            if(error.code === 'P2002'){
                throw new ConflictException('Already has this user');
            }
            throw new HttpException(error, 500);
        }
    }

    async login(loginDto: LoginDto){
        const user = await this.prismaService.users.findUnique({
            where: { username: loginDto.username}
        });
        if(!user){
            throw new NotFoundException('the user is not found')
        }
        const isValid = await compare(loginDto.password, user.password)
        if(!isValid){
            throw new UnauthorizedException('incorrect username or password')
        }

        const payload = {
            user_id: user.id,
            user_permission: user.permission
        }
        const token = await this.jwtService.signAsync(
            payload,
            { secret: process.env.JWT_SECRET }
        );

        const tokenDecode = this.jwtService.decode(token);

        return {
            access_token: token,
            expired_in: tokenDecode['exp'],
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                permission: user.permission
            }
        };
    }

    async getProfile(id: number){
        const user = await this.prismaService.users.findUnique({
            select: {
                id: true,
                name: true,
                username: true,
                permission: true
            },
            where: { id: id }
        });

        return user;
    }
}
