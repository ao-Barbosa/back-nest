import { Module } from '@nestjs/common';
import { TaskListsController } from './tasklists.controller';
import { TaskListsService } from './services/tasklists.service';
import { TasksService } from './services/tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskList } from './models/tasklist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskList])],
  controllers: [TaskListsController],
  providers: [TaskListsService, TasksService],
})
export class TasklistsModule {}
