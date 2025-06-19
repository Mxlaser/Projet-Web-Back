import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class HealthService {
  constructor(@InjectQueue('health') private readonly healthQueue: Queue) {}

  async addHealthJob(): Promise<void> {
    await this.healthQueue.add('ping', {
      timestamp: new Date().toISOString(),
    });
  }
}
