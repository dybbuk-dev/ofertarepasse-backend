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
        host: 'smtp.mailgun.org',
        port: 587,
        auth: {
          user: 'postmaster@sandbox50ce930cd1da4e4baabf3c36a43a6be0.mailgun.org',
          pass: 'a7d89e5f3f683b59e3681823cc8fa3fc-70c38fed-167bb8bb',
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
