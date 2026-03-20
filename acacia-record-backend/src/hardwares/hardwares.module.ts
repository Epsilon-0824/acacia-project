import { Module } from '@nestjs/common';
import { HardwaresService } from './hardwares.service';
import { HardwaresController } from './hardwares.controller';
import { PrismaModule } from 'src/shared/db/prisma/prisma.module';

@Module({
  imports: [PrismaModule],  
  controllers: [HardwaresController],
  providers: [HardwaresService],
})
export class HardwaresModule {}
