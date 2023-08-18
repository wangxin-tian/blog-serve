import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import * as history from 'connect-history-api-fallback';
import { NestExpressApplication } from '@nestjs/platform-express';
import rateLimit from 'express-rate-limit';
import * as compression from 'compression';
import { join } from 'path';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 设置访问频率
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 1000,
    }),
  );

  // web 安全，防常见漏洞
  // 注意：开发环境如果开启 nest static module 需要将 crossOriginResourcePolicy 设置为 false 否则 静态资源 跨域不可访问
  app.use(
    helmet({
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
      crossOriginResourcePolicy: false,
    }),
  );

  app.use(history());

  app.use(
    cors({
      origin: ['http://localhost:3000', 'http://118.195.140.233:3000'], // ['http://localhost:3000', 'http://47.115.221.109:3000'] 118.195.140.233
    }),
  ); //配置cors跨域

  app.use(compression()); //开启gzip压缩

  app.useStaticAssets(join(__dirname, '../public'), {
    maxAge: '1h',
    etag: true,
  });

  await app.listen(3002);
}
bootstrap();
