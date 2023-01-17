import {
  Body, CacheInterceptor, CacheKey, CacheTTL,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards, UseInterceptors,
} from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryEntity } from './entities/history.entity';
import { AddHistoryDto } from './dto/Add-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { JwtAuthGuard } from '../user/Guards/jwt-auth.guard';
import { User } from '../decorators/user.decorator';
import * as faker from 'faker';
import { Reflector } from '@nestjs/core';
@Controller('history')

export class HistoryController {
  constructor(
    private historyService: HistoryService,
    private reflector: Reflector
  ) { }

  @Get('faker')
  testFaker() {
    console.log('name example 👽');
    return faker.name.name;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllHistories(
    @User() user
  ): Promise<HistoryEntity[]> {
    return await this.historyService.getHistories(user);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async addHistory(
    @Body() addDto: AddHistoryDto,
    @User() user
  ): Promise<HistoryEntity> {
    return await this.historyService.addHistory(addDto, user);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async updateHistory2(
    @Body() updateObject,
    @User() user
  ) {
    const { updateCriteria, updateHistoryDto } = updateObject
    return await this.historyService.updatehistory2(updateCriteria, updateHistoryDto);
  }


  @Get('recover/:id')
  @UseGuards(JwtAuthGuard)
  async restoreHistory(
    @Param('id', ParseIntPipe) id: number,
    @User() user
  ) {
    return await this.historyService.restoreHistory(id, user);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  async getHistory(
    @Param('id', ParseIntPipe) id,
    @User() user
  ): Promise<HistoryEntity> {
    return await this.historyService.findHistoryById(id, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteHistory(
    @Param('id', ParseIntPipe) id: number,
    @User() user
  ) {
    return this.historyService.softDeleteHistory(id, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateHistory(
    @Body() updateHistoryDto: UpdateHistoryDto,
    @Param('id', ParseIntPipe) id: number,
    @User() user
  ): Promise<HistoryEntity> {
    return await this.historyService.updateHistory(id, updateHistoryDto, user);
  }
}
