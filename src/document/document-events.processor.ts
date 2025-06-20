import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('document-events')
export class DocumentEventsProcessor {
  @Process('created')
  handleCreated(job: Job) {
    console.log('📄 Document créé :', job.data);
  }

  @Process('deleted')
  handleDeleted(job: Job) {
    console.log('🗑️ Document supprimé :', job.data);
  }
}
