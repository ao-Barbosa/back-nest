import { ApiProperty } from '@nestjs/swagger';

export interface Task {
  _id: string;
  name: string;
  description: string;
  completed: boolean;
}

export class CreateTaskRequest {
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  completed: boolean;

  constructor({ name, description }: Pick<Task, 'name' | 'description'>) {
    this.name = name;
    this.description = description;
    this.completed = false;
  }
}

export class UpdateTaskRequest {
  @ApiProperty()
  name?: string;
  @ApiProperty()
  description?: string;
  @ApiProperty()
  completed?: boolean;

  constructor({
    name,
    description,
    completed,
  }: Partial<Pick<Task, 'name' | 'description' | 'completed'>>) {
    this.name = name;
    this.description = description;
    this.completed = completed;
  }
}

export class TaskResponse {
  @ApiProperty()
  _id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  completed: boolean;

  constructor({
    _id,
    name,
    description,
    completed,
  }: Pick<Task, '_id' | 'name' | 'description' | 'completed'>) {
    this._id = _id;
    this.name = name;
    this.description = description;
    this.completed = completed;
  }
}
