// main.ts or app.module.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with options
  app.enableCors({
    origin: 'http://localhost:3000', // The URL of your front-end
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // This allows credentials (e.g., cookies) to be sent with the request.
  });

  await app.listen(3001);
}

bootstrap();
