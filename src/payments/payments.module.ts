import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { AdvertsModule } from 'src/adverts/adverts.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [AdvertsModule, UsersModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
