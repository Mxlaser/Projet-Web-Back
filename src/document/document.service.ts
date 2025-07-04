import { InjectQueue } from '@nestjs/bull';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Queue } from 'bull';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '../user/entities/user.entity';
import { Role } from '../user/enums/role.enum';
import { CreateDocumentInput } from './dto/create-document.input';
import { UpdateDocumentInput } from './dto/update-document.input';
import { Document } from './entities/document.entity';

@Injectable()
export class DocumentService {
  constructor(
    @InjectQueue('documents') private documentsQueue: Queue,
    private prisma: PrismaService,
  ) {}

  async create(
    createDocumentInput: CreateDocumentInput,
    user: { userId: string; role: string },
  ): Promise<Document> {
    const document = await this.prisma.document.create({
      data: {
        title: createDocumentInput.title,
        description: createDocumentInput.description,
        fileUrl: createDocumentInput.fileUrl,
        userId: user.userId,
      },
      include: {
        user: true,
      },
    });

    // Ajouter un job à la queue pour le traitement asynchrone
    await this.documentsQueue.add('document.created', {
      documentId: document.id,
      userId: user.userId,
      action: 'created',
      timestamp: new Date(),
    });

    return {
      id: document.id,
      title: document.title,
      description: document.description,
      fileUrl: document.fileUrl,
      userId: document.userId,
      createdAt: document.createdAt,
      updatedAt: document.createdAt,
    };
  }

  async findAll(): Promise<Document[]> {
    const documents = await this.prisma.document.findMany({
      include: {
        user: true,
      },
    });

    return documents.map((doc) => ({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      fileUrl: doc.fileUrl,
      userId: doc.userId,
      createdAt: doc.createdAt,
      updatedAt: doc.createdAt,
    }));
  }

  async findByUser(userId: string): Promise<Document[]> {
    const documents = await this.prisma.document.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: true,
      },
    });

    return documents.map((doc) => ({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      fileUrl: doc.fileUrl,
      userId: doc.userId,
      createdAt: doc.createdAt,
      updatedAt: doc.createdAt,
    }));
  }

  async findOne(
    id: string,
    user: { userId: string; role: string },
  ): Promise<Document> {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    // Vérifier que l'utilisateur peut accéder au document
    if (document.userId !== user.userId && user.role !== 'ADMIN') {
      throw new ForbiddenException(
        'You do not have permission to access this document',
      );
    }

    return {
      id: document.id,
      title: document.title,
      description: document.description,
      fileUrl: document.fileUrl,
      userId: document.userId,
      createdAt: document.createdAt,
      updatedAt: document.createdAt,
    };
  }

  async update(
    id: string,
    updateDocumentInput: UpdateDocumentInput,
    user: { userId: string; role: string },
  ): Promise<Document> {
    const existingDocument = await this.prisma.document.findUnique({
      where: { id },
    });

    if (!existingDocument) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    // Vérifier que l'utilisateur peut modifier le document
    if (existingDocument.userId !== user.userId && user.role !== 'ADMIN') {
      throw new ForbiddenException(
        'You do not have permission to modify this document',
      );
    }

    const document = await this.prisma.document.update({
      where: { id },
      data: {
        title: updateDocumentInput.title,
        description: updateDocumentInput.description,
        fileUrl: updateDocumentInput.fileUrl,
      },
      include: {
        user: true,
      },
    });

    // Ajouter un job à la queue pour le traitement asynchrone
    await this.documentsQueue.add('document.updated', {
      documentId: id,
      userId: user.userId,
      action: 'updated',
      timestamp: new Date(),
    });

    return {
      id: document.id,
      title: document.title,
      description: document.description,
      fileUrl: document.fileUrl,
      userId: document.userId,
      createdAt: document.createdAt,
      updatedAt: document.createdAt,
    };
  }

  async remove(
    id: string,
    user: { userId: string; role: string },
  ): Promise<Document> {
    const existingDocument = await this.prisma.document.findUnique({
      where: { id },
    });

    if (!existingDocument) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    // Vérifier que l'utilisateur peut supprimer le document
    if (existingDocument.userId !== user.userId && user.role !== 'ADMIN') {
      throw new ForbiddenException(
        'You do not have permission to delete this document',
      );
    }

    const deletedDocument = await this.prisma.document.delete({
      where: { id },
      include: {
        user: true,
      },
    });

    // Ajouter un job à la queue pour le traitement asynchrone
    await this.documentsQueue.add('document.deleted', {
      documentId: id,
      userId: user?.userId,
      action: 'deleted',
      timestamp: new Date(),
    });

    return {
      id: deletedDocument.id,
      title: deletedDocument.title,
      description: deletedDocument.description,
      fileUrl: deletedDocument.fileUrl,
      userId: deletedDocument.userId,
      createdAt: deletedDocument.createdAt,
      updatedAt: deletedDocument.createdAt,
    };
  }

  async getDocumentUser(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role as Role,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
