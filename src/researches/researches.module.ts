import { Module } from '@nestjs/common';
import { ResearchesService } from './researches.service';
import { ResearchesController } from './researches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResearchEntity } from './entities/research.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ResearchEntity])],
  controllers: [ResearchesController],
  providers: [ResearchesService],
  exports: [ResearchesService],
})
export class ResearchesModule {}
