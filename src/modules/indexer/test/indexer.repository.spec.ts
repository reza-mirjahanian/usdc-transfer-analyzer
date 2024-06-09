import { Test, TestingModule } from '@nestjs/testing';
import { IndexerRepository } from '../indexer.repository';
import { PrismaService } from '../../database/prisma.service';

describe('IndexerRepository', () => {
  let repository: IndexerRepository;
  let prisma: PrismaService;

  const prismaMock = {
    log: {
      findMany: jest.fn(),
      createMany: jest.fn(),
      aggregate: jest
        .fn()
        .mockResolvedValue(
          Promise.resolve({ _sum: { transferAmount: 120000000n } }),
        ),
      groupBy: jest
        .fn()
        .mockResolvedValueOnce(
          Promise.resolve([
            {
              _sum: {
                transferAmount: 120000000n,
              },
              fromAddress: '0x123',
              _count: {
                fromAddress: 2,
              },
            },
          ]),
        )
        .mockResolvedValueOnce(
          Promise.resolve([
            {
              _sum: {
                transferAmount: 60000000n,
              },
              toAddress: '0x456',
              _count: {
                toAddress: 1,
              },
            },
          ]),
        ),
    },
    config: {
      findFirst: jest.fn(),
      upsert: jest.fn(),
    },
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, IndexerRepository],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    repository = app.get<IndexerRepository>(IndexerRepository);
    prisma = app.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(prisma).toBeDefined();
  });

  describe('insertNewLogs()', () => {
    beforeEach(() => {
      jest.spyOn(repository, 'findLogsWithBlockNumbers').mockResolvedValue([
        {
          id: '2',
          blockNumber: 2,
          index: 2,
          transactionIndex: 2,
          transferAmount: 200n,
          transactionHash: '0x123',
          tokenAddress: '0x456',
          fromAddress: '0x123',
          toAddress: '0x456',
          eventName: 'Transfer',
          timestamp: new Date(),
        },
      ]);
    });
    it('should call prisma.log.createMany correctly', async () => {
      const newItem = {
        blockNumber: 1,
        index: 1,
        transactionIndex: 1,
        transferAmount: 100,
        transactionHash: '0x123',
        tokenAddress: '0x456',
        fromAddress: '0x123',
        toAddress: '0x456',
        timestamp: new Date(),
      };
      const existInDb = {
        blockNumber: 2,
        index: 2,
        transactionIndex: 2,
        transferAmount: 200,
        transactionHash: '0x123',
        tokenAddress: '0x456',
        fromAddress: '0x123',
        toAddress: '0x456',
        timestamp: new Date(),
      };
      const newLogs = [newItem, existInDb];

      await repository.insertNewLogs(newLogs, [1, 2]);
      expect(prisma.log.createMany).toHaveBeenCalledWith({
        data: [newItem],
        skipDuplicates: true,
      });
    });
  });

  describe('findLogsWithBlockNumbers()', () => {
    it('should call prisma.log.findMany correctly', async () => {
      const blockNumbersList1 = [1, 2, 3];
      await repository.findLogsWithBlockNumbers(blockNumbersList1);
      expect(prisma.log.findMany).toHaveBeenCalledWith({
        where: {
          blockNumber: {
            in: blockNumbersList1,
          },
        },
      });
    });
  });

  describe('getConfig()', () => {
    it('should call prisma.config.findFirst correctly', async () => {
      const key = 'blockNumber';
      await repository.getConfig(key);
      expect(prisma.config.findFirst).toHaveBeenCalledWith({
        where: {
          key,
        },
      });
    });
  });

  describe('saveConfig()', () => {
    it('should call prisma.config.upsert correctly', async () => {
      const key = 'blockNumber';
      const value = 123;
      await repository.saveConfig(key, value);
      expect(prisma.config.upsert).toHaveBeenCalledWith({
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
    });
  });

  describe('getTotalAmountUSDC()', () => {
    it('should call prisma.log.aggregate correctly', async () => {
      const from = new Date();
      const to = new Date();
      const result = await repository.getTotalAmountUSDC(from, to);
      expect(prisma.log.aggregate).toHaveBeenCalledWith({
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

      expect(result).toEqual({
        total: '120',
        from,
        to,
      });
    });
  });

  describe('getLeaderBoardStats()', () => {
    it('should call prisma.log.groupBy correctly', async () => {
      const from = new Date();
      const to = new Date();
      const result = await repository.getLeaderBoardStats(from, to);

      expect(prisma.log.groupBy).toHaveBeenCalledWith({
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

      expect(prisma.log.groupBy).toHaveBeenCalledWith({
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

      expect(result).toEqual({
        fromStats: [{ address: '0x123', total: '120', count: 2 }],
        toStats: [{ address: '0x456', total: '60', count: 1 }],
        from,
        to,
      });
    });
  });
});
