import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { DocumentService } from './document.service';
import { CreateDocumentInput } from './dto/create-document.input';
import { Document } from './entities/document.entity';

@Resolver(() => Document)
export class DocumentResolver {
  constructor(private readonly documentService: DocumentService) {}

  @Query(() => [Document])
  async getDocumentsByUser(@Args('userId') userId: string): Promise<Document[]> {
    return this.documentService.getDocumentsByUser(userId);
  }

  @Mutation(() => Document)
  async createDocument(
    @Args('input') input: CreateDocumentInput,
    @Args('userId') userId: string,
  ): Promise<Document> {
    return this.documentService.createDocument(input, userId);
  }

  @Mutation(() => Boolean)
  async deleteDocument(@Args('id') id: string): Promise<boolean> {
    return this.documentService.deleteDocument(id);
  }
}
