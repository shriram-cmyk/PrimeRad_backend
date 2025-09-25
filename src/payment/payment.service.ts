import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  private razorpay: Razorpay;

  constructor(
    @Inject('DB') private readonly db: MySql2Database,
    private readonly configService: ConfigService,
  ) {
    this.razorpay = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_KEY_ID'),
      key_secret: this.configService.get<string>('RAZORPAY_KEY_SECRET'),
    });
  }

  /**
   * Create a Razorpay test order
   */
  async createRazorpayOrder(
    amount: number,
    currency = 'INR',
    receipt?: string,
  ) {
    try {
      const options = {
        amount: amount * 100,
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
        payment_capture: 1,
      };

      const order = await this.razorpay.orders.create(options);
      return { success: true, order };
    } catch (error) {
      console.error('Razorpay order creation failed:', error);
      throw new InternalServerErrorException('Failed to create Razorpay order');
    }
  }

  /**
   * Verify Razorpay payment signature
   */
  verifyPaymentSignature(payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      payload;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac(
        'sha256',
        this.configService.get<string>('RAZORPAY_KEY_SECRET') as any,
      )
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      return { success: true, message: 'Payment verified successfully' };
    } else {
      throw new ConflictException('Payment verification failed');
    }
  }
}
