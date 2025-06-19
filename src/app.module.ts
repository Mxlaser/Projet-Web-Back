import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { HelloResolver } from './hello/hello.resolver';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
    }),
    UserModule,
    AuthModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
        password: 'admin'
      },
    }),
    BullModule.registerQueue({
      name: 'health',
    }),
    HealthModule,
  ],
  providers: [HelloResolver],
})
export class AppModule {}
