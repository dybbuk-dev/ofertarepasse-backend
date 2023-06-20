import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdvertsService } from './adverts.service';
import { CreateAdvertDto } from './dto/create-advert.dto';
import { UpdateAdvertDto } from './dto/update-advert.dto';
import { AdvertEntity } from './entities/advert.entity';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('/api/v1/adverts')
export class AdvertsController {
  constructor(private readonly advertsService: AdvertsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createAdvertDto: CreateAdvertDto) {
    return this.advertsService.create(createAdvertDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('files'))
  @Post(':id/upload-file')
  async uploadImage(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.advertsService.uploadFiles(files, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/delete-file')
  async deleteImage(
    @Body('files') files: Array<string>,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.advertsService.deleteFiles(id, files);
  }

  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 20, @Query() query) {
    return this.advertsService.findAll({ page, limit, query });
  }

  @Get('/getFilterValues')
  filterValues() {
    return this.advertsService.getFilterValues();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: AdvertEntity['id']) {
    return this.advertsService.findOne({ where: { id } });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/views')
  views(@Query() query: { id?: string; advert?: string }) {
    return this.advertsService.views(query);
  }

  @Post('/recommendation')
  recommendation() {
    return this.advertsService.recommendation();
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: AdvertEntity['id'],
    @Body() updateAdvertDto: UpdateAdvertDto,
  ) {
    return this.advertsService.update(id, updateAdvertDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: AdvertEntity['id']) {
    return this.advertsService.remove(id);
  }
}
