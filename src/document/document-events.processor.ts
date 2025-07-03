import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

interface DocumentEvent {
  documentId: string;
  userId: string;
  action: 'created' | 'updated' | 'deleted';
  timestamp: Date;
}

@Processor('documents')
export class DocumentEventsProcessor {
  private readonly logger = new Logger(DocumentEventsProcessor.name);

  @Process('document.created')
  async handleDocumentCreated(job: Job<DocumentEvent>) {
    const { documentId, userId, action, timestamp } = job.data;

    this.logger.log(
      `Document ${action}: ID=${documentId}, UserID=${userId}, Time=${timestamp}`,
    );

    // Simulation d'un traitement asynchrone (audit, analytics, etc.)
    await this.simulateAsyncProcessing();

    this.logger.log(
      `Document ${action} processing completed for ID: ${documentId}`,
    );
  }

  @Process('document.updated')
  async handleDocumentUpdated(job: Job<DocumentEvent>) {
    const { documentId, userId, action, timestamp } = job.data;

    this.logger.log(
      `Document ${action}: ID=${documentId}, UserID=${userId}, Time=${timestamp}`,
    );

    // Simulation d'un traitement asynchrone (audit, analytics, etc.)
    await this.simulateAsyncProcessing();

    this.logger.log(
      `Document ${action} processing completed for ID: ${documentId}`,
    );
  }

  @Process('document.deleted')
  async handleDocumentDeleted(job: Job<DocumentEvent>) {
    const { documentId, userId, action, timestamp } = job.data;

    this.logger.log(
      `Document ${action}: ID=${documentId}, UserID=${userId}, Time=${timestamp}`,
    );

    // Simulation d'un traitement asynchrone (audit, analytics, etc.)
    await this.simulateAsyncProcessing();

    this.logger.log(
      `Document ${action} processing completed for ID: ${documentId}`,
    );
  }

  private async simulateAsyncProcessing(): Promise<void> {
    // Simulation d'un traitement qui prend du temps
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
