import { Status } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";

class CheckDto {
    @IsString()
    @IsNotEmpty()
    checkpointName: string;

    @IsString()
    @IsNotEmpty()
    status: Status;
}

export class CreateHardwareDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    serialNumber: string;

    @IsInt()
    @IsNotEmpty()
    userId: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CheckDto)
    checks: CheckDto[];
}
