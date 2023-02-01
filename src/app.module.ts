import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import configuration from './config/configuration';

import { AuthModule } from './auth/auth.module';
import { TasklistsModule } from './tasklists/tasklists.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mongodb',
        url: configService.get<string>('MONGO_CONNECTION_URL'),
        useNewUrlParser: true,
        entities: [join(__dirname, '**/**.entity.{ts,js}')],
        logging: ['error', 'query'],
        synchronized: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    TasklistsModule,
  ],
})
export class AppModule {}
