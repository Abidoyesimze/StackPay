import { MerchantModel } from '../models/merchant.model';
import { logger } from '../utils/logger';

async function createMerchant() {
  try {
    const email = process.argv[2];
    const businessName = process.argv[3];

    if (!email || !businessName) {
      console.error('Usage: ts-node src/scripts/create-merchant.ts <email> <business_name>');
      process.exit(1);
    }

    const { merchant, apiKey } = await MerchantModel.create(email, businessName);

    console.log('\n✅ Merchant created successfully!\n');
    console.log('Merchant ID:', merchant.id);
    console.log('Email:', merchant.email);
    console.log('Business Name:', merchant.businessName);
    console.log('\n⚠️  API Key (save this, it won\'t be shown again):');
    console.log(apiKey);
    console.log('\n');

    process.exit(0);
  } catch (error) {
    logger.error('Failed to create merchant', error);
    process.exit(1);
  }
}

createMerchant();