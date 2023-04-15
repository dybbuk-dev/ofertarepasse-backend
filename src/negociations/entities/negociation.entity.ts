import { AdvertEntity } from 'src/adverts/entities/advert.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('negociations')
export class NegociationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.negociations)
  user: UserEntity;

  @ManyToOne(() => AdvertEntity, (advert) => advert.negociations)
  advert: AdvertEntity;

  @Column()
  value: number;

  @Column({ default: 'in progress' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'update_at' })
  updateAt: string;
}
