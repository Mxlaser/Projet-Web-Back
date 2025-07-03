import { Injectable, ForbiddenException } from '@nestjs/common';
import { CreateDocumentInput } from './dto/create-document.input';
import { Document } from './entities/document.entity';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DocumentService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('document-events') private readonly eventQueue: Queue,
  ) {}

  async createDocument(input: CreateDocumentInput, userId: string): Promise<Document> {
    const newDoc = await this.prisma.document.create({
      data: {
        title: input.title,
        description: input.description,
        fileUrl: input.fileUrl,
        userId,
      },
    });

    await this.eventQueue.add('created', {
      documentId: newDoc.id,
      title: newDoc.title,
      userId: newDoc.userId,
      timestamp: new Date().toISOString(),
    });

    return newDoc;
  }

  async getDocumentsByUser(userId: string): Promise<Document[]> {
    return this.prisma.document.findMany({
      where: { userId },
    });
  }

  async deleteDocument(id: string, currentUserId: string, currentUserRole: string): Promise<boolean> {
    const doc = await this.prisma.document.findUnique({
      where: { id },
    });

    if (!doc) return false;

    const isOwner = doc.userId === currentUserId;
    const isAdmin = currentUserRole === 'ADMIN';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException("Vous n'avez pas le droit de supprimer ce document.");
    }

    await this.prisma.document.delete({
      where: { id },
    });

    await this.eventQueue.add('deleted', {
      documentId: doc.id,
      timestamp: new Date().toISOString(),
    });

    return true;
  }
}
