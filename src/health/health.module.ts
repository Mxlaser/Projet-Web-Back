import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { BullModule } from '@nestjs/bull';
import { HealthProcessor } from './health.processor';

@Module({
  imports: [BullModule.registerQueue({ name: 'health' })],
  controllers: [HealthController],
  providers: [HealthService, HealthProcessor],
})
export class HealthModule {}
