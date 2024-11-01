import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import { CustomLogger } from './custom-logger.service';


async function bootstrap() {
  const app = await NestFactory.create(AppModule
  /*, {logger: new CustomLogger(),}*/
 );
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
