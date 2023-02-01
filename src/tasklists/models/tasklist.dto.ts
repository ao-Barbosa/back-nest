import { ApiProperty } from '@nestjs/swagger';
import { Task, TaskResponse } from './task.dto';

interface TaskList {
  _id: string;
  name: string;
  description: string;
  tasks: Task[];
  userId: string;
}

export class CreateTaskListRequest {
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;

  constructor({ name, description }: Pick<TaskList, 'name' | 'description'>) {
    this.name = name;
    this.description = description;
  }
}

export class UpdateTaskListRequest {
  @ApiProperty()
  name?: string;
  @ApiProperty()
  description?: string;

  constructor({
    name,
    description,
  }: Partial<Pick<TaskList, 'name' | 'description'>>) {
    this.name = name;
    this.description = description;
  }
}

export class TaskListResponse {
  @ApiProperty()
  _id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty({ type: () => Array<Task> })
  tasks: TaskResponse[];
  @ApiProperty()
  userId: string;

  constructor({
    _id,
    name,
    description,
    userId,
    tasks = [],
  }: Pick<TaskList, '_id' | 'name' | 'description' | 'tasks' | 'userId'>) {
    this._id = _id;
    this.name = name;
    this.description = description;
    this.tasks = tasks;
    this.userId = userId;
  }
}
