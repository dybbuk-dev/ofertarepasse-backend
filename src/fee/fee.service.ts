import { Injectable } from '@nestjs/common';
import { FeeEntity } from './entities/fee.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFeeDto } from './dto/create-fee.dto';

@Injectable()
export class FeeService {
  constructor(
    @InjectRepository(FeeEntity)
    private readonly feeRepository: Repository<FeeEntity>,
  ) {}

  async setFee(feeAmount: number) {
    const fee = await this.feeRepository.findOne();
    if (!fee) {
      const newFee = this.feeRepository.create({ fee: feeAmount });
      await this.feeRepository.save(newFee);
      return newFee;
    } else {
      const newFee = this.feeRepository.update(fee.id, {
        fee: feeAmount,
      });
      return newFee;
    }
  }

  async getFee() {
    try {
      const fee = await this.feeRepository.findOne();
      if (!fee) {
        const newFee = this.feeRepository.create({ fee: 0 });
        await this.feeRepository.save(newFee);
        return newFee;
      }
      return fee;
    } catch (err) {
      console.log('get fee error', err);
      throw err;
    }
  }
}
