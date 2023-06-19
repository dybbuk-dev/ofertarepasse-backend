import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'fee' })
export class FeeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fee: number;
}
