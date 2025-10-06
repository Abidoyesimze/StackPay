import QRCode from 'qrcode';

export class QRGenerator {
  static async generateDataURL(text: string): Promise<string> {
    try {
      const qrDataUrl = await QRCode.toDataURL(text, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        width: 300,
        margin: 1,
      });
      return qrDataUrl;
    } catch (error) {
      throw new Error(`QR generation failed: ${error}`);
    }
  }

  static async generateBuffer(text: string): Promise<Buffer> {
    try {
      const buffer = await QRCode.toBuffer(text, {
        errorCorrectionLevel: 'M',
        type: 'png',
        width: 300,
      });
      return buffer;
    } catch (error) {
      throw new Error(`QR generation failed: ${error}`);
    }
  }
}
