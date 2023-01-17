import { CacheInterceptor, CacheModule, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirstMiddleware } from './middlewares/first.middleware';
import { logger } from './middlewares/Logger.middleware';
import { HelmetMiddleware } from '@nest-middlewares/helmet';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryModule } from './history/history.module';
import { UserModule } from './user/user.module';

import appConfig from './config/app.config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserEntity } from './user/entites/user.entity';
import { HistoryEntity } from './history/entities/history.entity';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig]
    }),
      TypeOrmModule.forRoot({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'quicktalkline',
        entities: [UserEntity,HistoryEntity],
        synchronize: true,
     
    }),
    HistoryModule,
    UserModule,
    EventEmitterModule.forRoot(),
    CacheModule.register({

    })
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor
    }
  ],
  exports: [AppService]
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(FirstMiddleware).forRoutes('hello',
      {path: 'todo', method: RequestMethod.GET},
      {path: 'todo*', method: RequestMethod.DELETE},
    )
      .apply(logger).forRoutes('')
      .apply(HelmetMiddleware).forRoutes('')
    ;
  }
}
