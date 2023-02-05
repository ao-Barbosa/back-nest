import { Module } from '@nestjs/common';
import { TaskListsController } from './tasklists.controller';
import { TaskListsService } from './services/tasklists.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskList, TaskListSchema } from './models/tasklist.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TaskList.name, schema: TaskListSchema },
    ]),
  ],
  controllers: [TaskListsController],
  providers: [TaskListsService],
})
export class TasklistsModule {}
