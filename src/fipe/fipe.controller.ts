import { Controller, Get, Query } from '@nestjs/common';
import { FipeService } from './fipe.service';

@Controller('/api/v1/fipe')
export class FipeController {
  constructor(private readonly fipeService: FipeService) {}

  @Get()
  create(@Query('plate') plate: string) {
    return this.fipeService.fipe(plate);
  }
}
