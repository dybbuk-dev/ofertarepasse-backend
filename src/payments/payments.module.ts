import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { AdvertsModule } from 'src/adverts/adverts.module';
import { UsersModule } from 'src/users/users.module';
import { EmailsModule } from 'src/emails/emails.module';
import { ConfigModule } from '@nestjs/config';
import { NegociationsModule } from 'src/negociations/negociations.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AdvertsModule,
    UsersModule,
    EmailsModule,
    NegociationsModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
