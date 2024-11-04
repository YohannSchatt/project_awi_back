import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
// import { CustomLogger } from './custom-logger.service';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule
  /*, {logger: new CustomLogger(),}*/
 );

 const front_end_url = process.env.FRONT_END_URL || 'http://localhost:4200';

 app.enableCors({
  origin: ['http://localhost:4200', 'http://127.0.0.1:4200', front_end_url],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
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
