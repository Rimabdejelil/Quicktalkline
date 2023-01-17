import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { HistoryService } from '../history/history.service';
import { UserService } from '../user/user.service';
import * as faker from 'faker';
import { UserRoleEnum } from '../enums/user-role.enum';
import { HistoryEntity } from '../history/entities/history.entity';
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const historyService = app.get(HistoryService);
  faker.local = 'fr';
  const userService = app.get(UserService);
  const users = await userService.findAll({role: UserRoleEnum.USER});
  for (let i = 1; i < 10 ; i++) {
    const newHistory = new HistoryEntity();
    newHistory.title = faker.name.title();
    newHistory.description = faker.name.descriptionTitle();
  
   
    console.log('the new history to add',newHistory);
    const user = users[Math.floor(Math.random() * users.length)];
    await historyService.addHistory(newHistory, user);
  }
  await app.close();
}
bootstrap();
