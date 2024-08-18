import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationFilter } from './application/filters/zod-validation.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from './application/filters/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalFilters(new ZodValidationFilter());

  const config = new DocumentBuilder()
    .setTitle('Backend Test Eigen')
    .setDescription('Eigen Backend Techincal Test')
    .setVersion('1.0')
    .addServer('http://localhost:8000/', 'Local environtment')
    .addTag('books')
    .addTag('members')
    .addTag('borrows')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalFilters(new PrismaClientExceptionFilter());

  await app.listen(process.env.PORT || 8000);
}
bootstrap();
