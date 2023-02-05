import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from './config/configuration';

import { AuthModule } from './auth/auth.module';
import { TasklistsModule } from './tasklists/tasklists.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/env/${process.env.NODE_ENV}.env`,
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_CONNECTION_URL'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    TasklistsModule,
  ],
})
export class AppModule {}
