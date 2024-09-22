import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import bodyParser from 'body-parser';

async function bootstrap() {

  
  
  const PORT = process.env.PORT || 5000;
  process.env.HOST = process.env.HOST || 'localhost'; //HOST est l'url qui sera fourni par ROUTE53
  const LOCAL_HOST = '0.0.0.0';
  const UI_URL = process.env.UI_URL || 'http://127.0.0.1:4200';
  
  // afficherResumeConfig(LOCAL_HOST, PORT, UI_URL);
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: UI_URL });

  
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ extended: true }));

  await app.listen(PORT, LOCAL_HOST);
}
bootstrap();
