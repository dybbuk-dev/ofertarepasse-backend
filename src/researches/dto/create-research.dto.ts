import { IsNotEmpty, IsOptional } from 'class-validator';
import { ResearchEntity } from '../entities/research.entity';

export class CreateResearchDto {
  @IsNotEmpty()
  text: ResearchEntity['text'];

  @IsOptional()
  access: ResearchEntity['access'];
}
