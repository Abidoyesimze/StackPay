/**
 * Format a number as BTC with proper decimal places
 */
export function formatBTC(amount: number, decimals: number = 8): string {
  return `${amount.toFixed(decimals)} BTC`;
}

/**
 * Convert satoshis to BTC
 */
export function satoshisToBTC(satoshis: number): number {
  return satoshis / 100000000;
}

/**
 * Convert BTC to satoshis
 */
export function btcToSatoshis(btc: number): number {
  return Math.round(btc * 100000000);
}
