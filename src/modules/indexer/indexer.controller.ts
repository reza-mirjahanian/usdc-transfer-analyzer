import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IndexerService } from './indexer.service';

@ApiTags('indexer')
@Controller('api')
@ApiResponse({ status: 400, description: 'Bad Request.' })
@ApiResponse({ status: 403, description: 'Forbidden.' })
@ApiResponse({ status: 500, description: 'Internal Server Error.' })
export class IndexerController {
  constructor(private readonly indexerService: IndexerService) {}

  @Get('/report/total/:from/:to')
  @ApiOperation({
    summary:
      'Aggregated data for USDC transferred in a given period (timestamp)',
  })
  @ApiParam({
    name: 'from',
    required: true,
    description: 'Start timestamp',
    type: Number,
  })
  @ApiParam({
    name: 'to',
    required: true,
    description: 'End timestamp',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Operation done successfully.',
  })
  async getTotalAmountUSDC(
    @Param('from', ParseIntPipe) from: number,
    @Param('to', ParseIntPipe) to: number,
  ) {
    if (from > to || from < 1 || to < 1) {
      throw new NotFoundException('Invalid range');
    }

    return this.indexerService.getTotalAmountUSDC(from, to);
  }

  @Get('/report/leaderboard/:from/:to')
  @ApiOperation({
    summary: 'Aggregated data for top accounts in a given period (timestamp)',
  })
  @ApiParam({
    name: 'from',
    required: true,
    description: 'Start timestamp',
    type: Number,
  })
  @ApiParam({
    name: 'to',
    required: true,
    description: 'End timestamp',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Operation done successfully.',
  })
  async getLeaderBoardStats(
    @Param('from', ParseIntPipe) from: number,
    @Param('to', ParseIntPipe) to: number,
  ) {
    if (from > to || from < 1 || to < 1) {
      throw new NotFoundException('Invalid range');
    }

    return this.indexerService.getLeaderBoardStats(from, to);
  }
}
