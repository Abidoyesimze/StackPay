import axios from 'axios';

export default class ConversionService {
  static async getRate(): Promise<number> {
    const resp = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
    );
    return resp.data.bitcoin.usd;
  }

  static async convertToBTC(usd: number): Promise<number> {
    const rate = await this.getRate();
    return usd / rate;
  }

  static async convertToUSD(btc: number): Promise<number> {
    const rate = await this.getRate();
    return btc * rate;
  }
}
