import { Injectable, Logger } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';
import { IndexerService } from './indexer.service';

// const EVERY_2_SECONDS = "*/2 * * * * *";

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly indexerService: IndexerService) {}

  // @Cron('2 * * * * *',{name: 'notifications'})
  // handleCron() {
  //   this.logger.debug('Called when the current second is 2');
  // }

  // @Cron(EVERY_2_SECONDS)
  // handleCron2() {
  //   this.logger.debug('Called every 2 seconds');
  // }

  // @Interval(10000)
  // handleInterval() {
  //   this.logger.debug('Called every 10 seconds');
  // }

  @Timeout(0)
  handleTimeout() {
    // Connect to the Avalanche blockchain using a provider
    this.indexerService.getLatestLogs();
  }
}
