import { Controller, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('/api/v1/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  @Post()
  create(@Body() data: CreatePaymentDto) {
    return this.paymentsService.create(data);
  }

  @Post('/nofifications')
  notification(@Body() data: any) {
    return this.paymentsService.notification(data);
  }
}
