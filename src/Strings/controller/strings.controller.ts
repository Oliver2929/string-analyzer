import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateStringDto } from '../dto/create-string.dto';
import { QueryStringsDto } from '../dto/query-strings.dto';
import { StringsService } from '../service/strings.service';

@Controller('strings')
export class StringsController {
  constructor(private readonly stringsService: StringsService) {}

  @Post()
  async create(@Body() dto: CreateStringDto) {
    return await this.stringsService.create(dto);
  }

  @Get('filter-by-natural-language')
  async naturalFilter(@Query('query') query: string) {
    return await this.stringsService.findByNaturalLanguage(query);
  }

  @Get()
  async findAll(@Query() query: QueryStringsDto) {
    return await this.stringsService.findAll(query);
  }

  @Get(':string_value')
  async findOne(@Param('string_value') string_value: string) {
    return await this.stringsService.findByValue(string_value);
  }

  @Delete(':string_value')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('string_value') string_value: string) {
    await this.stringsService.removeByValue(string_value);
    return;
  }
}
