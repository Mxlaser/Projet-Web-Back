import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { DocumentEventsProcessor } from './document-events.processor';
import { DocumentResolver } from './document.resolver';
import { DocumentService } from './document.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'documents',
    }),
    UserModule,
    PrismaModule,
  ],
  providers: [DocumentResolver, DocumentService, DocumentEventsProcessor],
  exports: [DocumentService],
})
export class DocumentModule {}
