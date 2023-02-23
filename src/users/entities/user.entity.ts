import { ApiHideProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { Status } from '../enum/status.enum';
import { Roles } from '../enum/roles.enum';
import { TypePerson } from '../enum/type.enum';
import { hashSync } from 'bcrypt';

@Entity('users')
@Unique(['email'])
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true, default: null })
  phone: string;

  @Column()
  type: TypePerson;

  @Column({ default: 'user' })
  roles: Roles;

  @ApiHideProperty()
  @Column({ select: false })
  password: string;

  @Column({ default: Status['active'] })
  status: Status;

  @Column({ type: 'date', nullable: true, default: null })
  dateOfBirth: Date;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @BeforeInsert()
  hasPassword() {
    this.password = hashSync(this.password, 10);
  }
}
