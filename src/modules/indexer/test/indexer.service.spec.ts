import { Test, TestingModule } from '@nestjs/testing';
import { IndexerRepository } from '../indexer.repository';
import { IndexerService } from '../indexer.service';
import { Block } from 'ethers';
import {
  GET_LAST_LOGS_DISTANCE,
  REPAIR_OLD_LOGS_STEP,
  START_BLOCK_KEY,
} from '../../../constants/server';

describe('IndexerService', () => {
  let repository: IndexerRepository;
  let service: IndexerService;

  const repositoryMock = {
    findLogsWithBlockNumbers: jest.fn(),
    insertNewLogs: jest.fn(),
    getConfig: jest.fn(),
    saveConfig: jest.fn(),
    getTotalAmountUSDC: jest.fn(),
    getLeaderBoardStats: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [IndexerService, IndexerRepository],
    })
      .overrideProvider(IndexerRepository)
      .useValue(repositoryMock)
      .compile();

    repository = app.get<IndexerRepository>(IndexerRepository);
    service = app.get<IndexerService>(IndexerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('getLatestFinalizedBlockNumber() should call jsonRpc.getBlock()', async () => {
    const blockNumber = 100;

    jest
      .spyOn(service['_jsonRpcProvider'], 'getBlock')
      .mockResolvedValue({ number: blockNumber } as unknown as Promise<Block>);
    expect(await service.getLatestFinalizedBlockNumber()).toBe(blockNumber);
  });

  it('getUSDCAddress() should return USDC address', () => {
    expect(service.getUSDCAddress()).toBe(
      '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
    );
  });

  it('findMissedLogs() should save logs and update start block', async () => {
    const startBlock = 100;
    const endBlock = startBlock + REPAIR_OLD_LOGS_STEP;

    jest.spyOn(repository, 'getConfig').mockResolvedValue(startBlock);
    jest.spyOn(service, 'saveEventLogs').mockResolvedValue(null);

    await service.findMissedLogs();

    expect(service.saveEventLogs).toHaveBeenCalledWith(startBlock, endBlock);
    expect(service.saveEventLogs).toHaveBeenCalledTimes(1);
    expect(repository.saveConfig).toHaveBeenCalledWith(
      START_BLOCK_KEY,
      endBlock + 1,
    );
    expect(repository.saveConfig).toHaveBeenCalledTimes(1);
  });

  it('findLatestLogs() should save logs from last block', async () => {
    const lastBlockNumber = 100;
    const fromBlock = lastBlockNumber - GET_LAST_LOGS_DISTANCE;

    jest
      .spyOn(service, 'getLatestFinalizedBlockNumber')
      .mockResolvedValue(lastBlockNumber);
    jest.spyOn(service, 'saveEventLogs').mockResolvedValue(null);

    await service.findLatestLogs();

    expect(service.saveEventLogs).toHaveBeenCalledWith(
      fromBlock,
      lastBlockNumber,
    );
    expect(service.saveEventLogs).toHaveBeenCalledTimes(1);
  });

  it('saveEventLogs() should save logs from start to end block', async () => {
    const fromBlock = 100;
    const toBlock = 200;
    const logs = [
      {
        provider: {},
        transactionHash:
          '0x557d284d80a08e22d874ff894322f194414b62766e81dc060ec225e2c42fd27f',
        blockHash:
          '0xb2bb33dd6270ecc3c4addcd3752fc0b2a83f8b50ec39dbef006457c2e6bdbeb8',
        blockNumber: 46529182,
        removed: false,
        address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
        data: '0x00000000000000000000000000000000000000000000000000000000004c4b40',
        topics: [
          '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
          '0x0000000000000000000000005785787c385de9e9298a342f4fe1de485cfb21b0',
          '0x00000000000000000000000016eab5c02fa9786c89ebb86059f596b3a4dc1f3b',
        ],
        index: 3,
        transactionIndex: 3,
      },
      {
        provider: {},
        transactionHash:
          '0x327bbaf0352eb18c5ccb71abe059c792daf25cc58eb6ea0abfd2fc5414c1fb0f',
        blockHash:
          '0xa3f46c3043e0870047ddccec85f897433e7ea2e16daff2ba0bf59ed7d210eec4',
        blockNumber: 46529178,
        removed: false,
        address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
        data: '0x0000000000000000000000000000000000000000000000000000000000cfdc82',
        topics: [
          '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
          '0x000000000000000000000000a7ca2c8673bcfa5a26d8ceec2887f2cc2b0db22a',
          '0x0000000000000000000000003bc40d4307cd946157447cd55d70ee7495ba6140',
        ],
        index: 4,
        transactionIndex: 1,
      },
    ];

    const timestamp = 1717804346;

    jest
      .spyOn(service['_jsonRpcProvider'], 'getLogs')
      .mockResolvedValue(logs as any);

    jest
      .spyOn(service['_jsonRpcProvider'], 'getBlock')
      .mockResolvedValue({ timestamp: timestamp } as any);

    jest.spyOn(repository, 'insertNewLogs').mockClear();

    await service.saveEventLogs(fromBlock, toBlock);

    expect(repository.insertNewLogs).toHaveBeenCalledWith(
      [
        {
          blockNumber: 46529182,
          index: 3,
          transactionIndex: 3,
          transferAmount: 5000000n,
          transactionHash:
            '0x557d284d80a08e22d874ff894322f194414b62766e81dc060ec225e2c42fd27f',
          tokenAddress: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
          fromAddress: '0x5785787C385De9e9298A342F4FE1de485cfB21b0',
          toAddress: '0x16EAb5c02fa9786C89Ebb86059f596b3A4DC1F3B',
          timestamp: new Date(timestamp * 1000),
        },
        {
          blockNumber: 46529178,
          index: 4,
          transactionIndex: 1,
          transferAmount: 13622402n,
          transactionHash:
            '0x327bbaf0352eb18c5ccb71abe059c792daf25cc58eb6ea0abfd2fc5414c1fb0f',
          tokenAddress: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
          fromAddress: '0xa7Ca2C8673bcFA5a26d8ceeC2887f2CC2b0Db22A',
          toAddress: '0x3bc40d4307cD946157447CD55d70ee7495bA6140',
          timestamp: new Date(timestamp * 1000),
        },
      ],
      [46529182, 46529178],
    );
    expect(repository.insertNewLogs).toHaveBeenCalledTimes(1);
  });

  it('getTotalAmountUSDC() should return total amount of USDC', async () => {
    const from = 1717804346;
    const to = 1717804347;
    jest.spyOn(repository, 'getTotalAmountUSDC');
    await service.getTotalAmountUSDC(from, to);
    expect(repository.getTotalAmountUSDC).toHaveBeenCalledWith(
      new Date(from * 1000),
      new Date(to * 1000),
    );
  });

  it('getLeaderBoardStats() should return leaderboard stats', async () => {
    jest.spyOn(repository, 'getLeaderBoardStats');
    const from = 1717804346;
    const to = 1717804347;
    await service.getLeaderBoardStats(from, to);
    expect(repository.getLeaderBoardStats).toHaveBeenCalledTimes(1);
    expect(repository.getLeaderBoardStats).toHaveBeenCalledWith(
      new Date(from * 1000),
      new Date(to * 1000),
    );
  });
});
