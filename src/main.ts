import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggerService } from './logger/logger.service';
import cookieParser from 'cookie-parser';
import { LoggingInterceptor } from './logger/logger.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.enableCors({
    origin: ['http://localhost:3000', 'https://your-frontend-domain.com'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Primerad Academy API')
    .setDescription('API documentation for Primerad Academy backend')
    .setVersion('1.0')
    .addCookieAuth('accessToken')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const logger = app.get(LoggerService);
  app.useLogger(logger);
  app.use(cookieParser());
  const port = process.env.PORT || 3000;
  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.listen(port, '0.0.0.0');
  logger.log(`Application started on http://localhost:${port}`);
}
bootstrap();
