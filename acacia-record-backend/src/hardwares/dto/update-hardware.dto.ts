import { PartialType } from '@nestjs/mapped-types';
import { CreateHardwareDto } from './create-hardware.dto';
import { IsArray, IsEnum, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Status } from '@prisma/client';
import { Type } from 'class-transformer';

class CheckDto {
    @IsInt()
    @IsOptional()
    id: number

    @IsString()
    @IsOptional()
    checkpointName: string;

    @IsEnum(Status)
    @IsOptional()
    status: Status;
}

export class UpdateHardwareDto extends PartialType(CreateHardwareDto) {
    @IsEnum(Status)
    @IsOptional()
    status?: Status;

    @IsInt()
    @IsOptional()
    userId?: number;

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CheckDto)
    checks?: CheckDto[];
}