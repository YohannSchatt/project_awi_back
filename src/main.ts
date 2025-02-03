import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
// import { CustomLogger } from './custom-logger.service';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule
  /*, {logger: new CustomLogger(),}*/
 );

 const configService = app.get(ConfigService);
 const urlFront = configService.get<string>('database.url_front');

 app.enableCors({
  origin: ['http://localhost:4200', 'http://127.0.0.1:4200', urlFront],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
})

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
