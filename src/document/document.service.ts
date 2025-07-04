import { InjectQueue } from '@nestjs/bull';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Queue } from 'bull';
import { User } from '../user/entities/user.entity';
import { Role } from '../user/enums/role.enum';
import { UserService } from '../user/user.service';
import { CreateDocumentInput } from './dto/create-document.input';
import { UpdateDocumentInput } from './dto/update-document.input';
import { Document } from './entities/document.entity';

@Injectable()
export class DocumentService {

  private documents: Document[];
  constructor(
    @InjectQueue('documents') private documentsQueue: Queue,
    private userService: UserService,
  ) {
    this.documents = [];
  }

  async create(
    createDocumentInput: CreateDocumentInput,
    user: User,
  ): Promise<Document> {
    const document: Document = {
      id: Math.random().toString(36).substr(2, 9),
      title: createDocumentInput.title,
      description: createDocumentInput.description,
      fileUrl: createDocumentInput.fileUrl,
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.documents.push(document);

    // Ajouter un job à la queue pour le traitement asynchrone
    await this.documentsQueue.add('document.created', {
      documentId: document.id,
      userId: user.id,
      action: 'created',
      timestamp: new Date(),
    });

    return document;
  }

  findAll(): Promise<Document[]> {
    return Promise.resolve(this.documents);
  }

  findByUser(userId: string): Promise<Document[]> {
    return Promise.resolve(
      this.documents.filter((doc) => doc.userId === userId),
    );
  }

  findOne(id: string, user: User): Promise<Document> {
    const document = this.documents.find((doc) => doc.id === id);

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    // Vérifier que l'utilisateur peut accéder au document
    if (document.userId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException(
        'You do not have permission to access this document',
      );
    }

    return Promise.resolve(document);
  }

  async update(
    id: string,
    updateDocumentInput: UpdateDocumentInput,
    user: User,
  ): Promise<Document> {
    const documentIndex = this.documents.findIndex((doc) => doc.id === id);

    if (documentIndex === -1) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    const document = this.documents[documentIndex];

    // Vérifier que l'utilisateur peut modifier le document
    if (document.userId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException(
        'You do not have permission to modify this document',
      );
    }

    // Mettre à jour le document
    this.documents[documentIndex] = {
      ...document,
      ...updateDocumentInput,
      updatedAt: new Date(),
    };

    // Ajouter un job à la queue pour le traitement asynchrone
    await this.documentsQueue.add('document.updated', {
      documentId: id,
      userId: user.id,
      action: 'updated',
      timestamp: new Date(),
    });

    return this.documents[documentIndex];
  }

  async remove(id: string, user: User): Promise<Document> {
    const documentIndex = this.documents.findIndex((doc) => doc.id === id);

    if (documentIndex === -1) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    const document = this.documents[documentIndex];

    // Vérifier que l'utilisateur peut supprimer le document
    if (document.userId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException(
        'You do not have permission to delete this document',
      );
    }

    const deletedDocument = this.documents.splice(documentIndex, 1)[0];

    // Ajouter un job à la queue pour le traitement asynchrone
    await this.documentsQueue.add('document.deleted', {
      documentId: id,
      userId: user.id,
      action: 'deleted',
      timestamp: new Date(),
    });

    return deletedDocument;
  }

  async getDocumentUser(userId: string): Promise<User> {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return {
      ...user,
      role: user.role as Role,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
