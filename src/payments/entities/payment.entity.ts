import { AdvertEntity } from 'src/adverts/entities/advert.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payments')
export class PaymentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.negociations)
  payer: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.negociations)
  receiver: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.negociations)
  intermediary: UserEntity;

  @ManyToOne(() => AdvertEntity, (advert) => advert.negociations)
  advert: AdvertEntity;

  @Column({ name: 'payment_link' })
  paymentLink: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'update_at' })
  updateAt: string;

  @DeleteDateColumn({ name: 'delete_at' })
  deleteAt: string;
}
