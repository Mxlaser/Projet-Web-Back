import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';

@ObjectType()
export class Document {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  fileUrl: string;

  @Field()
  userId: string;

  @Field(() => User)
  user?: User;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
