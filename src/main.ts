import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RemoveXPoweredByInterceptor } from './remove-x-powered-by.interceptor';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.listen(3001);
  app.useGlobalInterceptors(new RemoveXPoweredByInterceptor());
  app.use(helmet());
}
bootstrap();
