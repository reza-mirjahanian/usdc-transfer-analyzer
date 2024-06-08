import { Module } from '@nestjs/common';
import { IndexerService } from './indexer.service';
import { TasksService } from './taskService';
import { PrismaModule } from '../database/prisma.module';
import { IndexerRepository } from './indexer.repository';

@Module({
  imports: [PrismaModule],
  providers: [IndexerService, TasksService, IndexerRepository],
  exports: [IndexerService],
})
export class IndexerModule {}
