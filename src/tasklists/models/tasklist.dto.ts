import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { TaskResponse } from './task.dto';

export class CreateTaskListRequest {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly description: string;
}

export class UpdateTaskListRequest {
  @ApiProperty()
  readonly name?: string;

  @ApiProperty()
  readonly description?: string;
}

export class TaskListResponse {
  @ApiProperty()
  readonly _id: ObjectId;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly description: string;

  @ApiProperty()
  readonly tasks: [TaskResponse];

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly updatedAt: Date;
}
