import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
// import * as fs from 'fs';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

class SocketAdapter extends IoAdapter {
  createIOServer(
    port: number,
    options?: ServerOptions & {
      namespace?: string;
      server?: any;
    },
  ) {
    const server = super.createIOServer(port, { ...options, cors: true });
    return server;
  }
}
async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync(
  //     '/etc/letsencrypt/live/api.mallerr.com/privkey.pem',
  //     'utf8',
  //   ),
  //   cert: fs.readFileSync(
  //     '/etc/letsencrypt/live/api.mallerr.com/cert.pem',
  //     'utf8',
  //   ),
  //   ca: fs.readFileSync(
  //     '/etc/letsencrypt/live/api.mallerr.com/chain.pem',
  //     'utf8',
  //   ),
  // };

  const app = await NestFactory.create(
    AppModule,
    // { cors: true },
    // { httpsOptions }
  );

  // const config = new DocumentBuilder()
  //   .setTitle('Global SMN')
  //   .setDescription('Global SMNDocumentation')
  //   .setVersion('1.0')
  //   .build();
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('/', app, document);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useWebSocketAdapter(new SocketAdapter(app));
  await app.listen(process.env.PORT);
}
bootstrap();
