import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IndexerModule } from './modules/indexer/indexer.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), IndexerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
