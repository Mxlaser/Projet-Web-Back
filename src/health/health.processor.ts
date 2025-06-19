import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('health')
export class HealthProcessor {
  @Process('ping')
  handlePing(job: Job) {
    console.log('✅ Health job received:', job.data);
  }
}
