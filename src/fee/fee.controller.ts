import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { FeeService } from './fee.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('/api/v1/fee')
export class FeeController {
  constructor(private readonly feeService: FeeService) {}

  @Get()
  async getFee() {
    return this.feeService.getFee();
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch()
  async setFee(@Body() { fee }: { fee: number }) {
    return this.feeService.setFee(fee);
  }
}
