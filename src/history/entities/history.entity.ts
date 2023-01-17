import { ManyToOne, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TimestampEntites } from '../../Generics/timestamp.entites.';
import { UserEntity } from '../../user/entites/user.entity';


@Entity('history')
export class HistoryEntity extends TimestampEntites {

  @PrimaryGeneratedColumn()
  id: number;

  
  @Column({
    length: 50
  })
  title: string;

  @Column()
  description: string;

 

  

  @ManyToOne(
    type => UserEntity,
    (user) => user.histories,
    {
      cascade: ['insert', 'update'],
      nullable: true,
      eager: true
    }
  )
  user: UserEntity;

}
