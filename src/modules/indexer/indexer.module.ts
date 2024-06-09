import { Module } from '@nestjs/common';
import { IndexerService } from './indexer.service';
import { TasksService } from './taskService';
import { PrismaModule } from '../database/prisma.module';
import { IndexerRepository } from './indexer.repository';
import { IndexerController } from './indexer.controller';

@Module({
  imports: [PrismaModule],
  providers: [IndexerService, TasksService, IndexerRepository],
  controllers: [IndexerController],
  exports: [IndexerService],
})
export class IndexerModule {}
