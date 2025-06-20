import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { DocumentService } from './document.service';
import { CreateDocumentInput } from './dto/create-document.input';
import { Document } from './entities/document.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => Document)
export class DocumentResolver {
  constructor(private readonly documentService: DocumentService) {}

  @Query(() => [Document])
  async getDocumentsByUser(
    @Args('userId') userId: string,
  ): Promise<Document[]> {
    return this.documentService.getDocumentsByUser(userId);
  }

  @Mutation(() => Document)
  @UseGuards(JwtAuthGuard)
  async createDocument(
    @Args('input') input: CreateDocumentInput,
    @Args('userId') userId: string,
  ): Promise<Document> {
    return this.documentService.createDocument(input, userId);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteDocument(@Args('id') id: string, @CurrentUser() user: any) {
    return this.documentService.deleteDocument(id, user.userId, user.role);
  }
}
