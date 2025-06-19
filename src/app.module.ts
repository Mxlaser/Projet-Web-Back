import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
        password: 'admin'
      },
    }),
    BullModule.registerQueue({
      name: 'health',
    }),
    HealthModule,
  ],
})
export class AppModule {}
