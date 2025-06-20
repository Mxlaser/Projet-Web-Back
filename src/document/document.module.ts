import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentResolver } from './document.resolver';
import { BullModule } from '@nestjs/bull';
import { DocumentEventsProcessor } from './document-events.processor';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'document-events' }),
  ],
  providers: [
    DocumentService,
    DocumentResolver,
    DocumentEventsProcessor,
  ],
})
export class DocumentModule {}
