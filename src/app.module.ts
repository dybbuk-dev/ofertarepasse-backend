import * as dotenv from 'dotenv';
dotenv.config();
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AdvertsModule } from './adverts/adverts.module';
import { FavoritesModule } from './favorites/favorites.module';
import { S3Module } from './s3/s3.module';
import { NegociationsModule } from './negociations/negociations.module';
import { EmailsModule } from './emails/emails.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { PaymentsModule } from './payments/payments.module';
import { ResearchesModule } from './researches/researches.module';
import { FipeModule } from './fipe/fipe.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      autoLoadEntities: true,
      synchronize: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: '',
        port: 587,
        auth: {
          user: '',
          pass: '',
        },
      },
    }),
    UsersModule,
    AuthModule,
    AdvertsModule,
    FavoritesModule,
    S3Module,
    NegociationsModule,
    EmailsModule,
    PaymentsModule,
    ResearchesModule,
    FipeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
