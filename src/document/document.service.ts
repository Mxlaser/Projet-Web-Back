import { Injectable } from '@nestjs/common';
import { CreateDocumentInput } from './dto/create-document.input';
import { Document } from './entities/document.entity';
import { v4 as uuidv4 } from 'uuid';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class DocumentService {
  private documents: Document[] = [];

  constructor(
    @InjectQueue('document-events') private readonly eventQueue: Queue,
  ) {}


  async createDocument(input: CreateDocumentInput, userId: string): Promise<Document> {
    const newDoc: Document = {
      id: uuidv4(),
      ...input,
      userId,
    };

    this.documents.push(newDoc);

    await this.eventQueue.add('created', {
      documentId: newDoc.id,
      title: newDoc.title,
      userId: newDoc.userId,
      timestamp: new Date().toISOString(),
    });

    return newDoc;
  }

  async getDocumentsByUser(userId: string): Promise<Document[]> {
    return this.documents.filter(doc => doc.userId === userId);
  }

  async deleteDocument(id: string): Promise<boolean> {
    const index = this.documents.findIndex(doc => doc.id === id);
    if (index === -1) return false;

    const [deleted] = this.documents.splice(index, 1);

    await this.eventQueue.add('deleted', {
      documentId: deleted.id,
      timestamp: new Date().toISOString(),
    });

    return true;
  }
}
