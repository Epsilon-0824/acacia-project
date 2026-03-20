import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class LoginDto{
    @IsNotEmpty({ message: 'กรอก username'})
    username: string;

    @IsNotEmpty({ message: 'กรอก password'})
    @MinLength(8, { message: 'password ต้องไม่น้อยกว่า $constraint1 ตัวอักษร'})
    password: string;
}