import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Role } from '../enums/role.enum';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  fullName: string;

  @Field(() => Role)
  role: Role;
}

registerEnumType(Role, {
  name: 'Role',
});
