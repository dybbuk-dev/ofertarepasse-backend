import { UserEntity } from './../../users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'adverts' })
export class AdvertEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  plate: string;

  @Column('simple-array', { nullable: true, default: null })
  images: string[];

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  fuel: string;

  @Column({ nullable: true, default: null })
  amountPeaple: number;

  @Column({ nullable: true, default: null })
  rolling: number;

  @Column({ name: 'model_year' })
  modelYear: string;

  @Column({ name: 'manufacture_year' })
  manufactureYear: string;

  @Column()
  version: string;

  @Column()
  color: string;

  @Column({ default: 0 })
  kilometer: number;

  @Column()
  value: number;

  @Column({ nullable: true, default: null })
  about: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  userId: string;

  @Column({ default: 0 })
  views: number;

  @Column({ default: true })
  active: boolean;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column('simple-array', { nullable: true, default: null })
  highlight: string[];
}
