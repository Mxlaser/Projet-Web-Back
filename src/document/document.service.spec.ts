import { getQueueToken } from '@nestjs/bull';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '../user/enums/role.enum';
import { UserService } from '../user/user.service';
import { DocumentService } from './document.service';
import { CreateDocumentInput } from './dto/create-document.input';
import { UpdateDocumentInput } from './dto/update-document.input';
import { PrismaService } from '../../prisma/prisma.service';

describe('DocumentService', () => {
  let service: DocumentService;
  let userService: UserService;
  let mockQueue: any;

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    fullName: 'Test User',
    role: Role.USER,
    createdAt: new Date(),
  };

  const mockAdminUser = {
    id: 'admin-1',
    email: 'admin@example.com',
    fullName: 'Admin User',
    role: Role.ADMIN,
    createdAt: new Date(),
  };

  const mockCreateDocumentInput: CreateDocumentInput = {
    title: 'Test Document',
    description: 'Test Description',
    fileUrl: 'https://example.com/file.pdf',
  };

  beforeEach(async () => {
    mockQueue = {
      add: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        {
          provide: PrismaService,
          useValue: {
            document: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: 'BullQueue_document-events',
          useValue: {
            add: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new document', async () => {
      const result = await service.create(mockCreateDocumentInput, mockUser);

      expect(result).toHaveProperty('id');
      expect(result.title).toBe(mockCreateDocumentInput.title);
      expect(result.description).toBe(mockCreateDocumentInput.description);
      expect(result.fileUrl).toBe(mockCreateDocumentInput.fileUrl);
      expect(result.userId).toBe(mockUser.id);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);

      expect(mockQueue.add).toHaveBeenCalledWith('document.created', {
        documentId: result.id,
        userId: mockUser.id,
        action: 'created',
        timestamp: expect.any(Date),
      });
    });
  });

  describe('findAll', () => {
    it('should return all documents', async () => {
      // Create a document first
      await service.create(mockCreateDocumentInput, mockUser);

      const result = await service.findAll();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('findByUser', () => {
    it('should return documents for a specific user', async () => {
      // Create a document for the user
      await service.create(mockCreateDocumentInput, mockUser);

      const result = await service.findByUser(mockUser.id);
      expect(Array.isArray(result)).toBe(true);
      expect(result.every((doc) => doc.userId === mockUser.id)).toBe(true);
    });

    it('should return empty array for user with no documents', async () => {
      const result = await service.findByUser('non-existent-user');
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a document if user owns it', async () => {
      const createdDoc = await service.create(
        mockCreateDocumentInput,
        mockUser,
      );
      const result = await service.findOne(createdDoc.id, mockUser);

      expect(result).toEqual(createdDoc);
    });

    it('should return a document if user is admin', async () => {
      const createdDoc = await service.create(
        mockCreateDocumentInput,
        mockUser,
      );
      const result = await service.findOne(createdDoc.id, mockAdminUser);

      expect(result).toEqual(createdDoc);
    });

    it('should throw NotFoundException for non-existent document', async () => {
      await expect(
        service.findOne('non-existent-id', mockUser),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not own document and is not admin', async () => {
      const createdDoc = await service.create(
        mockCreateDocumentInput,
        mockUser,
      );
      const otherUser = { ...mockUser, id: 'other-user' };

      await expect(service.findOne(createdDoc.id, otherUser)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('update', () => {
    it('should update a document if user owns it', async () => {
      const createdDoc = await service.create(
        mockCreateDocumentInput,
        mockUser,
      );
      const updateInput: UpdateDocumentInput = {
        id: createdDoc.id,
        title: 'Updated Title',
      };

      const result = await service.update(createdDoc.id, updateInput, mockUser);

      expect(result.title).toBe('Updated Title');
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(mockQueue.add).toHaveBeenCalledWith('document.updated', {
        documentId: createdDoc.id,
        userId: mockUser.id,
        action: 'updated',
        timestamp: expect.any(Date),
      });
    });

    it('should update a document if user is admin', async () => {
      const createdDoc = await service.create(
        mockCreateDocumentInput,
        mockUser,
      );
      const updateInput: UpdateDocumentInput = {
        id: createdDoc.id,
        title: 'Updated by Admin',
      };

      const result = await service.update(
        createdDoc.id,
        updateInput,
        mockAdminUser,
      );

      expect(result.title).toBe('Updated by Admin');
    });

    it('should throw NotFoundException for non-existent document', async () => {
      const updateInput: UpdateDocumentInput = {
        id: 'non-existent-id',
        title: 'Updated Title',
      };

      await expect(
        service.update('non-existent-id', updateInput, mockUser),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not own document and is not admin', async () => {
      const createdDoc = await service.create(
        mockCreateDocumentInput,
        mockUser,
      );
      const otherUser = { ...mockUser, id: 'other-user' };
      const updateInput: UpdateDocumentInput = {
        id: createdDoc.id,
        title: 'Updated Title',
      };

      await expect(
        service.update(createdDoc.id, updateInput, otherUser),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should remove a document if user owns it', async () => {
      const createdDoc = await service.create(
        mockCreateDocumentInput,
        mockUser,
      );
      const result = await service.remove(createdDoc.id, mockUser);

      expect(result).toEqual(createdDoc);
      expect(mockQueue.add).toHaveBeenCalledWith('document.deleted', {
        documentId: createdDoc.id,
        userId: mockUser.id,
        action: 'deleted',
        timestamp: expect.any(Date),
      });

      // Verify document is removed
      const allDocs = await service.findAll();
      expect(allDocs.find((doc) => doc.id === createdDoc.id)).toBeUndefined();
    });

    it('should remove a document if user is admin', async () => {
      const createdDoc = await service.create(
        mockCreateDocumentInput,
        mockUser,
      );
      const result = await service.remove(createdDoc.id, mockAdminUser);

      expect(result).toEqual(createdDoc);
    });

    it('should throw NotFoundException for non-existent document', async () => {
      await expect(service.remove('non-existent-id', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user does not own document and is not admin', async () => {
      const createdDoc = await service.create(
        mockCreateDocumentInput,
        mockUser,
      );
      const otherUser = { ...mockUser, id: 'other-user' };

      await expect(service.remove(createdDoc.id, otherUser)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('getDocumentUser', () => {
    it('should return user for document', async () => {
      const result = await service.getDocumentUser(mockUser.id);
      expect(result).toEqual(mockUser);
      expect(userService.findOne).toHaveBeenCalledWith(mockUser.id);
    });
  });
});
