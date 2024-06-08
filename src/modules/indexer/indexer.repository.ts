import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class IndexerRepository {
  private readonly logger = new Logger(IndexerRepository.name);
  constructor(private readonly prisma: PrismaService) {}

  async insertNewPlayers(list: Prisma.LogCreateInput[]) {
    this.logger.debug(`Creating  ${list.length}  new logs`);

    return this.prisma.log.createMany({
      data: list,
      skipDuplicates: true,
    });
  }

  // async findManyPlayers(userNames: string[]) {
  //   this.logger.debug('Find players with username');
  //   return this.prisma.player.findMany({
  //     where: {
  //       userName: {
  //         in: userNames,
  //       },
  //     },
  //   });
  // }
  //
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
