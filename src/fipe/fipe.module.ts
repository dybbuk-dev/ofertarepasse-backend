import { Module } from '@nestjs/common';
import { FipeService } from './fipe.service';
import { FipeController } from './fipe.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [FipeController],
  providers: [FipeService],
})
export class FipeModule {}
