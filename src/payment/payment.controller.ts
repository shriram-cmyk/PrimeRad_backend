import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateOrderDto } from './dto/create-order-dto';
import { VerifyPaymentDto } from './dto/verify-payment-dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-order')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user', 'faculty')
  async createOrder(@Body() dto: CreateOrderDto, @Req() req: any) {
    // req.user available if you want to store user info
    return this.paymentService.createRazorpayOrder(
      dto.amount,
      dto.currency,
      dto.receipt,
    );
  }

  @Post('verify-payment')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user', 'faculty')
  async verifyPayment(@Body() dto: VerifyPaymentDto) {
    return this.paymentService.verifyPaymentSignature(dto);
  }
}
