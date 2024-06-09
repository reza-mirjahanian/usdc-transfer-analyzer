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

  async getTotalAmountUSDC(from: Date, to: Date) {
    this.logger.debug(`Get total amount USDC from ${from} to ${to}`);
    const { _sum } = await this.prisma.log.aggregate({
      _sum: {
        transferAmount: true,
      },
      where: {
        timestamp: {
          gte: from,
          lte: to,
        },
      },
    });
    return {
      total: (_sum.transferAmount / 6n).toString() || 0, // Decimal for USDC is 6.
      from,
      to,
    };
  }

  async getLeaderBoardStats(from: Date, to: Date) {
    this.logger.debug(`Leader board data from ${from} to ${to}`);
    const fromAddressData = await this.prisma.log.groupBy({
      by: ['fromAddress'],
      _sum: {
        transferAmount: true,
      },
      _count: {
        fromAddress: true,
      },
      where: {
        timestamp: {
          gte: from,
          lte: to,
        },
      },
      orderBy: {
        _sum: {
          transferAmount: 'desc',
        },
      },
      take: 10,
    });
    const fromStats = fromAddressData.map((item) => {
      return {
        address: item.fromAddress,
        total: (item._sum.transferAmount / 6n).toString() || 0, // Decimal for USDC is 6.
        count: item._count.fromAddress,
      };
    });

    const toAddressData = await this.prisma.log.groupBy({
      by: ['toAddress'],
      _sum: {
        transferAmount: true,
      },
      _count: {
        toAddress: true,
      },
      where: {
        timestamp: {
          gte: from,
          lte: to,
        },
      },
      orderBy: {
        _sum: {
          transferAmount: 'desc',
        },
      },
      take: 10,
    });

    const toStats = toAddressData.map((item) => {
      return {
        address: item.toAddress,
        total: (item._sum.transferAmount / 6n).toString() || 0, // Decimal for USDC is 6.
        count: item._count.toAddress,
      };
    });

    return {
      fromStats,
      toStats,
      from,
      to,
    };
  }
}
