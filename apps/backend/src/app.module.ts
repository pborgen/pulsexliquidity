import { Module, CacheModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppControllerRedis } from './app.controller.redis';
import { AppService } from './app.service';

import * as redisStore from 'cache-manager-redis-store';


@Module({
  imports: [CacheModule.register({
    store: redisStore,
    host: 'localhost',
    port: 6379
  })],
  //controllers: [AppController, AppControllerRedis],
  controllers: [AppControllerRedis],
  providers: [AppService],
})
export class AppModule { }
