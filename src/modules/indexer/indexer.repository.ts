import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class IndexerRepository {
  private readonly logger = new Logger(IndexerRepository.name);
  constructor(private readonly prisma: PrismaService) {}

  async insertNewLogs(
    logs: Prisma.LogCreateInput[],
    blockNumbersList: number[],
  ) {
    this.logger.debug(`inserting  ${logs.length}  new logs`);

    // Check if logs already exist in the database
    const existingLogs = await this.findLogsWithBlockNumbers(blockNumbersList);
    const existingBlockNumbers = existingLogs.map((log) => log.blockNumber);
    this.logger.debug(`Existing logs: ${existingLogs.length}`);
    const newLogs = logs.filter(
      (log) => !existingBlockNumbers.includes(log.blockNumber),
    );
    this.logger.debug(`New logs: ${newLogs.length}`);

    return this.prisma.log.createMany({
      data: newLogs,
      skipDuplicates: true,
    });
  }

  async findLogsWithBlockNumbers(blockNumbersList: number[]) {
    this.logger.debug('Find Logs with block numbers');
    return this.prisma.log.findMany({
      where: {
        blockNumber: {
          in: blockNumbersList,
        },
      },
    });
  }

  async getConfig(key: string) {
    const record = await this.prisma.config.findFirst({
      where: {
        key,
      },
    });
    if (record) {
      return record.value;
    } else {
      return null;
    }
  }

  async saveConfig(key: string, value: number) {
    return this.prisma.config.upsert({
      where: {
        key,
      },
      update: {
        value,
      },
      create: {
        key,
        value,
      },
    });
  }

  //
  // async findTopPlayers(count: number) {
  //   if (count < 1 || count > 1000) {
  //     // Validation
  //     count = 10;
  //   }
  //   this.logger.debug(`Find top ${count} players`);
  //   return this.prisma.player.findMany({
  //     orderBy: {
  //       ordinal: 'desc',
  //     },
  //     take: count,
  //   });
  // }
}
