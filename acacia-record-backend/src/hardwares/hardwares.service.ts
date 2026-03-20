import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHardwareDto } from './dto/create-hardware.dto';
import { UpdateHardwareDto } from './dto/update-hardware.dto';
import { PrismaService } from 'src/shared/db/prisma/prisma.service';
import { Hardwares } from '@prisma/client';

@Injectable()
export class HardwaresService {
  constructor(private readonly prismaService: PrismaService){}

  async create(createHardwareDto: CreateHardwareDto) {
    const { name, serialNumber, userId, checks } = createHardwareDto;
    const hardware = await this.prismaService.hardwares.create({
      data: {
        name,
        serialNumber,
        checks: {
          create: checks.map((check) => ({
            checkpointName: check.checkpointName,
            status: check.status,
            lastUpdatedBy: userId,
          })),
        }
      },
      include: {
        checks: true
      }
    });
    return hardware;
  }

  async findAll(): Promise<Hardwares[]> {
    const hardware = await this.prismaService.hardwares.findMany({
      orderBy: { id: 'asc'},
      include: {
        checks: {
          include: {
            user: {
              select: { name: true }
            }
          },
          orderBy: { updatedAt: 'desc' }
        }
      }
    })
    return hardware;
  }

  async findOne(id: number): Promise<Hardwares> {
    const hardware = await this.prismaService.hardwares.findUnique({
      where: { id: id },
      include: {
        checks: {
          include: {
            user: {
              select: { name: true }
            }
          }
        }
      }
    });
    if(!hardware){
      throw new NotFoundException('ไม่พบรายการนี้ในระบบ')
    }
    return hardware;
  }

  async update(id: number, updateHardwareDto: UpdateHardwareDto): Promise<Hardwares> {
    const { status, userId, checks, ...hardwareData } = updateHardwareDto;
    await this.prismaService.hardwares.update({
      where: { id },
      data: hardwareData,
    });

    if (checks && checks.length > 0) {
      await Promise.all(
        checks.map((check) =>
          this.prismaService.hardwareChecks.update({
            where: { id: check.id },
            data: {
              status: check.status,
              checkpointName: check.checkpointName,
              lastUpdatedBy: userId,
            },
          })
        )
      );
    }

    const hardware = await this.prismaService.hardwares.findUnique({
      where: { id },
      include: { checks: true }
    })
    if(!hardware){
      throw new NotFoundException('ไม่พบรายการนี้ในระบบ')
    }
    return hardware;
  }

  async remove(id: number): Promise<Hardwares> {
    const hardware = await this.prismaService.hardwares.delete({
      where: { id: id }
    })
    return hardware;
  }
}
