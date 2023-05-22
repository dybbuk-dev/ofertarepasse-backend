import { FavoriteEntity } from 'src/favorites/entities/favorite.entity';
import { ApiHideProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { Status } from '../enum/status.enum';
import { Roles } from '../enum/roles.enum';
import { TypePerson } from '../enum/type.enum';
import { hashSync } from 'bcrypt';
import { NegociationEntity } from 'src/negociations/entities/negociation.entity';
import { AdvertEntity } from 'src/adverts/entities/advert.entity';

@Entity('users')
@Unique(['email'])
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, default: null })
  image: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true, default: null })
  phone: string;

  @Column()
  type: TypePerson;

  @Column({ default: null })
  cpf: string;

  @Column({ default: null })
  cnpj: string;

  @Column({ default: null })
  cep: string;

  @Column({ default: null })
  pix: string;

  @Column({ default: 'user' })
  roles: Roles;

  @ApiHideProperty()
  @Column({ select: false })
  password: string;

  @Column({ default: Status['active'] })
  status: Status;

  @Column({ type: 'timestamp', nullable: true, default: null })
  dateOfBirth: Date;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @DeleteDateColumn()
  deleted_at: string;

  @OneToMany(() => FavoriteEntity, (favorite) => favorite.user, {
    cascade: true,
  })
  favorites: FavoriteEntity[];

  @OneToMany(() => NegociationEntity, (negociations) => negociations.user, {
    cascade: true,
  })
  negociations: NegociationEntity[];

  @OneToMany(() => AdvertEntity, (advert) => advert.user, {
    cascade: true,
  })
  adverts: AdvertEntity[];

  @BeforeInsert()
  hasPassword() {
    this.password = hashSync(this.password, 10);
  }
}
