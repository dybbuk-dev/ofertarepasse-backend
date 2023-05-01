import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('researchs')
export class ResearchEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @Column({ default: 0, nullable: true })
  access: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;
}
