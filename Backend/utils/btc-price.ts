import axios from 'axios';
import { config } from '../config/env';
import { redis } from '../config/redis';
import { logger } from './logger';

const BTC_PRICE_CACHE_KEY = 'btc:usd:price';
const CACHE_EXPIRY_SECONDS = 60; // 1 minute

export class BTCPriceService {
  static async getBTCToUSD(): Promise<number> {
    try {
      // Check cache first
      const cached = await redis.get(BTC_PRICE_CACHE_KEY);
      if (cached) {
        return parseFloat(cached);
      }

      // Fetch from API
      const response = await axios.get(config.btcPriceApi);
      const usdRate = response?.data?.data?.rates?.USD;

      if (!usdRate) {
        throw new Error('USD rate not found in API response');
      }

      const price = parseFloat(usdRate);

      // Cache the result in Redis
      await redis.set(BTC_PRICE_CACHE_KEY, price.toString(), CACHE_EXPIRY_SECONDS);

      return price;
    } catch (error) {
      logger.error('Failed to fetch BTC price', error);
      throw new Error('Unable to fetch BTC price');
    }
  }

  static async convertUSDToBTC(usdAmount: number): Promise<number> {
    const btcPrice = await this.getBTCToUSD();
    return usdAmount / btcPrice;
  }

  static async convertBTCToUSD(btcAmount: number): Promise<number> {
    const btcPrice = await this.getBTCToUSD();
    return btcAmount * btcPrice;
  }
}
3