import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NegociationsService } from './negociations.service';
import { CreateNegociationDto } from './dto/create-negociation.dto';
import { UpdateNegociationDto } from './dto/update-negociation.dto';
import { ParseUUIDPipe } from '@nestjs/common/pipes/parse-uuid.pipe';
import { AuthGuard } from '@nestjs/passport';

@Controller('/api/v1/negociations')
export class NegociationsController {
  constructor(private readonly negociationsService: NegociationsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createNegociationDto: CreateNegociationDto) {
    return this.negociationsService.create(createNegociationDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(
    @Query('userId') user: string,
    @Query('intermeriary') intermediary: string,
    @Query('limit') limit: string,
    @Query('page') page: string,
    @Query('status') status: string,
    @Query('search') search: string,
  ) {
    return this.negociationsService.findAll(
      user,
      intermediary,
      +limit,
      status,
      +page,
      search,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.negociationsService.findOne({ where: { id } });
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateNegociationDto: UpdateNegociationDto,
  ) {
    return this.negociationsService.update(id, updateNegociationDto);
  }
}
