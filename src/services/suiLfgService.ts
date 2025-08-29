import { TransactionBlock } from '@mysten/sui.js/transactions';
import { suiClient } from './suiClient';

// These are the FINAL, correct IDs from our Testnet deployment.
const PACKAGE_ID = "0xcf193485031382bafd1427d2e5c9f0d18c7d4bdda096b306964c34fb8136b06a";
const FAUCET_POOL_ID = "0x6cfe5955b9a0be3a85b6df032a196a9788b4b21f47cdde5052a6d77de3deb368";

// --- FAUCET ---
/**
 * Creates the transaction block for claiming from the faucet.
 * This function DOES NOT execute the transaction, it only builds it.
 * @returns {TransactionBlock} - The constructed transaction block.
 */
export const createFaucetTx = () => {
  const txb = new TransactionBlock();

  // Define the target for our smart contract call
  const target = `${PACKAGE_ID}::suilfg_testnet_v1::faucet`;

  // Add the transaction to the block.
  // The arguments must match the function signature in the Move contract:
  // faucet(pool: &mut FaucetPool, clock: &Clock, ctx: &mut TxContext)
  txb.moveCall({
    target: target,
    arguments: [
      // Arg 1: The FaucetPool object. We pass its ID.
      txb.object(FAUCET_POOL_ID),
      // Arg 2: The special Clock object, which is always at address 0x6.
      txb.object("0x6"),
    ],
  });

  return txb;
};

// --- "PAYMENT" ACTION ---
export function createPaymentTx(signAndExecuteTransactionBlock: any, userUsdcCoin: any) {
  const txb = new TransactionBlock();
  txb.moveCall({
    target: `${PACKAGE_ID}::suilfg_testnet_v1::do_action_with_payment`,
    arguments: [txb.object("0x000000000000000000000000000000000000000000000000000000000000000000"), txb.object(userUsdcCoin.coinObjectId)],
  });
  return signAndExecuteTransactionBlock({ transactionBlock: txb });
}

// --- "FREE" ACTION ---
export function createFreeTx(signAndExecuteTransactionBlock: any) {
  const txb = new TransactionBlock();
  txb.moveCall({
    target: `${PACKAGE_ID}::suilfg_testnet_v1::do_action_free`,
    arguments: [],
  });
  return signAndExecuteTransactionBlock({ transactionBlock: txb });
}

// Renamed for clarity: gas-only, no real payment
export function createGasOnlyTx(signAndExecuteTransactionBlock: any) {
  return createFreeTx(signAndExecuteTransactionBlock);
}

// --- GET USER USDC COINS ---
export async function getUserUsdcCoins(walletAddress: string) {
  try {
    const coins = await suiClient.getCoins({
      owner: walletAddress,
      coinType: "0x2::coin::Coin<0x2::sui::SUI>",
    });
    return coins.data;
  } catch (error) {
    console.error('Error fetching USDC coins:', error);
    return [];
  }
}