import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ResearchesService } from './researches.service';
import { CreateResearchDto } from './dto/create-research.dto';

@Controller('/api/v1/researches')
export class ResearchesController {
  constructor(private readonly researchesService: ResearchesService) {}

  @Post()
  create(@Body() createResearchDto: CreateResearchDto) {
    return this.researchesService.create(createResearchDto);
  }

  @Get()
  findAll(@Query('limit') limit: string, @Query('search') search: string) {
    return this.researchesService.findAll(+limit, search);
  }

  @Patch(':id')
  update(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.researchesService.amountAccess(id);
  }
}
