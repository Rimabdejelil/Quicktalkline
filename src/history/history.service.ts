import { CACHE_MANAGER, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { HistoryEntity } from './entities/history.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddHistoryDto } from './dto/Add-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { UserRoleEnum } from '../enums/user-role.enum';
import { UserService } from '../user/user.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENTS } from '../config/events';
import {Cache} from 'cache-manager';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(HistoryEntity)
    private historyRepository: Repository<HistoryEntity>,
    private userService: UserService,
    private eventEmitter: EventEmitter2,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {
  }

  async findHistoryById(id: number, user) {

    const history = await this.historyRepository.findOne(id);
    if(! history) {
      throw new NotFoundException(`Le history d'id ${id} n'existe pas`);
    }
    // Si on est admin ou si on est admin et on a pas de user
    if (this.userService.isOwnerOrAdmin(history, user)) {
     
      return history;
    }
    else
      throw new UnauthorizedException();
  }
  async getHistories(user): Promise<HistoryEntity[]> {
    if (user.role === UserRoleEnum.ADMIN)
      return await this.historyRepository.find();
    return await this.historyRepository.find({user});
  }

  async addHistory(history: AddHistoryDto, user): Promise<HistoryEntity> {
    const newHistory = this.historyRepository.create(history);
    newHistory.user = user;
    await this.historyRepository.save(newHistory);
    this.eventEmitter.emit(EVENTS.HISTORY_ADD, {
      title: newHistory.title
    });
    return newHistory;
  }

  async updateHistory(id: number, history: UpdateHistoryDto, user): Promise<HistoryEntity> {
    //On récupére le History d'id id et ensuite on remplace les anciennes valeurs de ce History
    // par ceux du History passé en paramètre
    const newHistory = await this.historyRepository.preload({
      id,
      ...history
    });
    // tester le cas ou le history d'id id n'existe pas
    if(! newHistory) {
      throw new NotFoundException(`Le history d'id ${id} n'existe pas`);
    }
    //sauvgarder la nouvelle entité donc le nouveau history
   if (this.userService.isOwnerOrAdmin(newHistory, user))
      return await this.historyRepository.save(newHistory);
    else
      new UnauthorizedException('');
  }

  updatehistory2(updateCriteria, history: UpdateHistoryDto ) {
    return this.historyRepository.update(updateCriteria, history);
  }


  async softDeleteHistory(id: number, user) {
    const history = await this.historyRepository.findOne({id});
    console.log('history', history);
    if (!history) {
      throw new NotFoundException('');
    }
    if (this.userService.isOwnerOrAdmin(history, user))
      return this.historyRepository.softDelete(id);
    else
      throw new UnauthorizedException('');
  }

  async restoreHistory(id: number, user) {

    const history = await this.historyRepository.query("select * from history where id = ?", [id]);
    if (!history) {
      throw new NotFoundException('');
    }
    if (this.userService.isOwnerOrAdmin(history, user))
      return this.historyRepository.restore(id);
    else
      throw new UnauthorizedException('');
  }

  async deleteHistory(id: number) {
    return await this.historyRepository.delete(id);
  }

  
}
