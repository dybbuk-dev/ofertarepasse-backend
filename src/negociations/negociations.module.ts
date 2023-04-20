import { Module } from '@nestjs/common';
import { NegociationsService } from './negociations.service';
import { NegociationsController } from './negociations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NegociationEntity } from './entities/negociation.entity';
import { EmailsModule } from 'src/emails/emails.module';
import { AdvertsModule } from 'src/adverts/adverts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NegociationEntity]),
    EmailsModule,
    AdvertsModule,
  ],
  controllers: [NegociationsController],
  providers: [NegociationsService],
  exports: [NegociationsService],
})
export class NegociationsModule {}
