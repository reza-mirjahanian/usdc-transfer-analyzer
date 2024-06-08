import { Injectable } from '@nestjs/common';
import {
  AVALANCHE_RPC_NODE,
  AVALANCHE_USDC_ADDRESS,
  TRANSFER_EVENT_SIGHASH,
  TRANSFER_EVENT_SIGNATURE,
} from '../../constants/avalanche';
import { ethers } from 'ethers';
import { GET_LAST_LOGS_DISTANCE } from '../../constants/server';
import { IndexerRepository } from './indexer.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class IndexerService {
  private readonly _jsonRpcProvider: ethers.JsonRpcProvider;

  constructor(private readonly indexerRepository: IndexerRepository) {
    this._jsonRpcProvider = new ethers.JsonRpcProvider(AVALANCHE_RPC_NODE);
  }

  async getLatestBlockNumber() {
    try {
      return await this._jsonRpcProvider.getBlockNumber();
    } catch (error) {
      console.error('Error in getLatestBlockNumber():', error);
      throw new Error(error);
    }
  }

  getUSDCAddress() {
    return ethers.getAddress(AVALANCHE_USDC_ADDRESS);
  }

  async getLatestLogs() {
    try {
      const lastBlockNumber = await this.getLatestBlockNumber();
      const fromBlock = lastBlockNumber - GET_LAST_LOGS_DISTANCE;

      const logs = await this._jsonRpcProvider.getLogs({
        fromBlock: fromBlock,
        toBlock: lastBlockNumber,
        topics: [ethers.id(TRANSFER_EVENT_SIGHASH)], //fragment.format("sighash"))
        address: this.getUSDCAddress(),
      });

      const USDC_ABI = [TRANSFER_EVENT_SIGNATURE];
      const transferEventInterface = new ethers.Interface(USDC_ABI);

      const cache: Map<number, number> = new Map();
      const dbData: Prisma.LogCreateInput[] = [];
      for (const log of logs) {
        //todo: is "removed" field important?
        const data = transferEventInterface.parseLog(log);
        const { blockNumber, address, transactionHash } = log;
        const { args } = data;
        const fromAddress = args[0];
        const toAddress = args[1];
        const transferAmount = args[2];

        if (!cache.has(blockNumber)) {
          const block = await this._jsonRpcProvider.getBlock(blockNumber);
          const { timestamp } = block;
          cache.set(blockNumber, timestamp);
        }

        dbData.push({
          blockNumber,
          transferAmount, // Decimal for USDC is 6.
          transactionHash,
          tokenAddress: address, // USDC contract address
          fromAddress,
          toAddress,
          timestamp: new Date(cache.get(blockNumber) * 1000),
        });
      } //end for

      await this.indexerRepository.insertNewPlayers(dbData);
    } catch (error) {
      console.error('Error in getLatestLogs():', error);
      throw new Error(error);
    }

    console.debug('getLatestLogs() finished successfully.');
  }
}
