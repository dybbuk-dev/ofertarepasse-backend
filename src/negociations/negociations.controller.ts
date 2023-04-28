import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { NegociationsService } from './negociations.service';
import { CreateNegociationDto } from './dto/create-negociation.dto';
import { UpdateNegociationDto } from './dto/update-negociation.dto';
import { ParseUUIDPipe } from '@nestjs/common/pipes/parse-uuid.pipe';

@Controller('/api/v1/negociations')
export class NegociationsController {
  constructor(private readonly negociationsService: NegociationsService) {}

  @Post()
  create(@Body() createNegociationDto: CreateNegociationDto) {
    return this.negociationsService.create(createNegociationDto);
  }

  @Get()
  findAll(
    @Query('userId') user: string,
    @Query('limit') limit: string,
    @Query('page') page: string,
    @Query('status') status: string,
    @Query('search') search: string,
  ) {
    return this.negociationsService.findAll(
      user,
      +limit,
      status,
      +page,
      search,
    );
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.negociationsService.findOne({ where: { id } });
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateNegociationDto: UpdateNegociationDto,
  ) {
    return this.negociationsService.update(id, updateNegociationDto);
  }

  @Post('/nofification')
  notification(@Body() data: any) {
    return this.negociationsService.notification(data);
  }
}
