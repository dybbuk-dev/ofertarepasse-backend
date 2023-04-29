import { FavoriteEntity } from 'src/favorites/entities/favorite.entity';
import { UserEntity } from './../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NegociationEntity } from 'src/negociations/entities/negociation.entity';

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

  @Column({ nullable: true, default: null })
  alert: string;

  @ManyToOne(() => UserEntity, (user) => user.adverts)
  user: UserEntity;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  proposals: number;

  @Column({ default: true })
  active: boolean;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column('simple-array', { nullable: true, default: null })
  highlight: string[];

  @Column({ name: 'fipe_value' })
  fipeValue: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => FavoriteEntity, (favorite) => favorite.advert)
  favorites: FavoriteEntity[];

  @OneToMany(() => NegociationEntity, (negociation) => negociation.advert)
  negociations: NegociationEntity[];
}
