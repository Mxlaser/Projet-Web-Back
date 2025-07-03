import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { User } from '../user/entities/user.entity';
import { Role } from '../user/enums/role.enum';
import { DocumentService } from './document.service';
import { CreateDocumentInput } from './dto/create-document.input';
import { UpdateDocumentInput } from './dto/update-document.input';
import { Document } from './entities/document.entity';

@Resolver(() => Document)
export class DocumentResolver {
  constructor(private readonly documentService: DocumentService) {}

  @Query(() => [Document], { name: 'documents' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.documentService.findAll();
  }

  @Query(() => [Document], { name: 'myDocuments' })
  @UseGuards(JwtAuthGuard)
  findMyDocuments(@CurrentUser() user: User) {
    return this.documentService.findByUser(user.id);
  }

  @Query(() => Document, { name: 'document' })
  @UseGuards(JwtAuthGuard)
  findOne(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.documentService.findOne(id, user);
  }

  @Mutation(() => Document)
  @UseGuards(JwtAuthGuard)
  createDocument(
    @Args('createDocumentInput') createDocumentInput: CreateDocumentInput,
    @CurrentUser() user: User,
  ) {
    return this.documentService.create(createDocumentInput, user);
  }

  @Mutation(() => Document)
  @UseGuards(JwtAuthGuard)
  updateDocument(
    @Args('updateDocumentInput') updateDocumentInput: UpdateDocumentInput,
    @CurrentUser() user: User,
  ) {
    return this.documentService.update(
      updateDocumentInput.id,
      updateDocumentInput,
      user,
    );
  }

  @Mutation(() => Document)
  @UseGuards(JwtAuthGuard)
  removeDocument(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.documentService.remove(id, user);
  }

  @ResolveField(() => User)
  user(@Parent() document: Document) {
    return this.documentService.getDocumentUser(document.userId);
  }
}
