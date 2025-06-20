import { Injectable, ForbiddenException } from '@nestjs/common';
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

  async createDocument(
    input: CreateDocumentInput,
    userId: string,
  ): Promise<Document> {
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

  getDocumentsByUser(userId: string): Document[] {
    return this.documents.filter((doc) => doc.userId === userId);
  }

  async deleteDocument(
    id: string,
    currentUserId: string,
    currentUserRole: string,
  ): Promise<boolean> {
    const doc = this.documents.find((d) => d.id === id);
    if (!doc) return false;

    const isOwner = doc.userId === currentUserId;
    const isAdmin = currentUserRole === 'admin';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        "Vous n'avez pas le droit de supprimer ce document."
      ) as never;
    }

    this.documents = this.documents.filter((d) => d.id !== id);

    await this.eventQueue.add('deleted', {
      documentId: doc.id,
      timestamp: new Date().toISOString(),
    });

    return true;
  }
}
