export const AVALANCHE_RPC_NODE =
  process.env.AVALANCHE_RPC_NODE || 'https://api.avax.network/ext/bc/C/rpc';

export const AVALANCHE_USDC_ADDRESS =
  process.env.AVALANCHE_USDC_ADDRESS ||
  '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e';

export const TRANSFER_EVENT_SIGNATURE =
  'event Transfer(address indexed from, address indexed to, uint256 value)';

export const TRANSFER_EVENT_SIGHASH = 'Transfer(address,address,uint256)';
