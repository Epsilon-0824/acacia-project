import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpCode, UseGuards } from '@nestjs/common';
import { HardwaresService } from './hardwares.service';
import { CreateHardwareDto } from './dto/create-hardware.dto';
import { UpdateHardwareDto } from './dto/update-hardware.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller({
  version: '1',
  path: 'hardwares'
})
export class HardwaresController {
  constructor(private readonly hardwaresService: HardwaresService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createHardwareDto: CreateHardwareDto) {
    const hardware = await this.hardwaresService.create(createHardwareDto)
    return {
      message: 'เพิ่มข้อมูลสำเร็จ',
      data: hardware
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.hardwaresService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.hardwaresService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateHardwareDto: UpdateHardwareDto) {
    return this.hardwaresService.update(id, updateHardwareDto);
  }

  // @Patch(':id')
  // check(@Param('id', ParseIntPipe) id: number, @Body() updateHardwareDto: UpdateHardwareDto) {
  //   return this.hardwaresService.update(id, updateHardwareDto);
  // }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.hardwaresService.remove(+id)
    return {
      message: 'ลบข้อมูลสำเร็จ'
    };
  }
}
