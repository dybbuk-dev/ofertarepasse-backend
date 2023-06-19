import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Module } from 'src/s3/s3.module';
import { FeeEntity } from './entities/fee.entity';
import { FeeService } from './fee.service';
import { FeeController } from './fee.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FeeEntity]), S3Module],
  controllers: [FeeController],
  providers: [FeeService],
})
export class FeeModule {}
