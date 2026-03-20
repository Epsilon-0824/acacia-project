import { Permission } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterDto{

    @IsString({ message: 'ชื่อสกุล ต้องเป็นตัวอักษรเท่านั้น'})
    @IsNotEmpty({ message: 'ชื่อสกุล ห้ามว่าง'})
    @MinLength(3, { message: 'ชื่อสกุล ต้องไม่น้อยกว่า $constraint1 ตัวอักษร'})
    name: string;

    @IsNotEmpty({ message: 'กรอก username'})
    username: string;

    @IsNotEmpty({ message: 'กรอก password'})
    @MinLength(8, { message: 'รหัสผ่าน ต้องไม่น้อยกว่า $constraint1 ตัวอักษร'})
    password: string;

    @IsOptional()
    @IsEnum(Permission, { message: 'สิทธิ์การใช้งานไม่ถูกต้อง' })
    permission?: Permission;
}