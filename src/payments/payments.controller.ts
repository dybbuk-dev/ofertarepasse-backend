import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('/api/v1/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() data: CreatePaymentDto) {
    return this.paymentsService.create(data);
  }

  @Post('/notifications')
  notification(@Body() data: any) {
    return this.paymentsService.notification(data);
  }
}
