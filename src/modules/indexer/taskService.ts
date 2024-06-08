import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { IndexerService } from './indexer.service';
import { RUN_LATEST_LOGS_WORKER_INTERVAL } from '../../constants/server';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly indexerService: IndexerService) {}

  @Interval(RUN_LATEST_LOGS_WORKER_INTERVAL)
  async runGetLatestLogsWorker() {
    // Connect to the Avalanche blockchain using a provider
    this.logger.verbose('Getting latest logs worker started...');
    await this.indexerService.getLatestLogs();
  }
}
