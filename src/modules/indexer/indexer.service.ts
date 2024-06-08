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

  async getLatestFinalizedBlockNumber() {
    try {
      const finalizedBlock = await this._jsonRpcProvider.getBlock('finalized');
      return finalizedBlock.number;
    } catch (error) {
      console.error('Error in getLatestFinalizedBlockNumber():', error);
      throw new Error(error);
    }
  }

  getUSDCAddress() {
    return ethers.getAddress(AVALANCHE_USDC_ADDRESS);
  }

  async getLatestLogs() {
    const lastBlockNumber = await this.getLatestFinalizedBlockNumber();
    const fromBlock = lastBlockNumber - GET_LAST_LOGS_DISTANCE;
    await this.saveEventLogs(fromBlock, lastBlockNumber);
  }

  async saveEventLogs(fromBlock: number, toBlock: number) {
    try {
      const logs = await this._jsonRpcProvider.getLogs({
        fromBlock,
        toBlock,
        topics: [ethers.id(TRANSFER_EVENT_SIGHASH)], //fragment.format("sighash"))
        address: this.getUSDCAddress(),
      });

      const USDC_ABI = [TRANSFER_EVENT_SIGNATURE];
      const transferEventInterface = new ethers.Interface(USDC_ABI);

      const blockTimeCache: Map<number, number> = new Map();
      const newLogs: Prisma.LogCreateInput[] = [];
      const blockNumbersList: Set<number> = new Set();
      for (const log of logs) {
        //todo: is "removed" field important?
        const parsedLog = transferEventInterface.parseLog(log);
        const {
          blockNumber,
          address,
          transactionHash,
          index,
          transactionIndex,
        } = log;
        const { args } = parsedLog;
        const fromAddress = args[0];
        const toAddress = args[1];
        const transferAmount = args[2];

        if (!blockTimeCache.has(blockNumber)) {
          const block = await this._jsonRpcProvider.getBlock(blockNumber);
          const { timestamp } = block;
          blockTimeCache.set(blockNumber, timestamp);
        }

        blockNumbersList.add(blockNumber);

        newLogs.push({
          blockNumber,
          index,
          transactionIndex,
          transferAmount, // Decimal for USDC is 6.
          transactionHash,
          tokenAddress: address, // USDC contract address
          fromAddress,
          toAddress,
          timestamp: new Date(blockTimeCache.get(blockNumber) * 1000),
        });
      } //end for

      await this.indexerRepository.insertNewLogs(newLogs, [
        ...blockNumbersList,
      ]);
    } catch (error) {
      console.error(
        `Error in saveEventLogs() fromBlock: ${fromBlock} toBlock: ${toBlock}`,
        error,
      );
      //todo: store block range in a table to retry later
      throw new Error(error);
    }

    console.debug(
      'saveEventLogs() finished successfully.',
      `fromBlock: ${fromBlock} toBlock: ${toBlock}`,
    );
  }
}
