import { STACKS_MAINNET, STACKS_TESTNET, StacksNetwork } from '@stacks/network';
import { config as stacksConfig } from './env';

export const getNetwork = (): StacksNetwork => {
  return stacksConfig.stacks.network === 'mainnet' 
    ? STACKS_MAINNET 
    : STACKS_TESTNET;
};

export const NETWORK = getNetwork();

export const CONTRACT_ADDRESS = stacksConfig.stacks.contractAddress;
export const CONTRACT_NAME = stacksConfig.stacks.contractName;
export const ESCROW_PRIVATE_KEY = stacksConfig.stacks.escrowPrivateKey;

