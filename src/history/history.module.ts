import { CacheModule, Module } from '@nestjs/common';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryEntity } from './entities/history.entity';
import { UserModule } from '../user/user.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([HistoryEntity]),
    UserModule,
    CacheModule.register({

    })
  ],
  controllers: [HistoryController],
  providers: [HistoryService]
})
export class HistoryModule {}
