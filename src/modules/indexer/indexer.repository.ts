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

  // async findPlayer(userName: string) {
  //   this.logger.debug(`Find a player with username: ${userName}`);
  //   return this.prisma.player.findFirst({
  //     where: {
  //       userName,
  //     },
  //   });
  // }
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
