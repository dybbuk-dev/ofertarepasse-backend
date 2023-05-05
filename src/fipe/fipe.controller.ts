import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FipeService } from './fipe.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('/api/v1/fipe')
export class FipeController {
  constructor(private readonly fipeService: FipeService) {}

  @Get()
  create(@Query('plate') plate: string) {
    return this.fipeService.fipe(plate);
  }
}
