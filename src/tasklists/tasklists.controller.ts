import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUserId } from 'src/auth/decorators/AuthUser';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  CreateTaskRequest,
  TaskResponse,
  UpdateTaskRequest,
} from './models/task.dto';
import {
  CreateTaskListRequest,
  UpdateTaskListRequest,
} from './models/tasklist.dto';
import { TaskList } from './models/tasklist.schema';
import { TaskListsService } from './services/tasklists.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('TaskList')
@Controller('tasklists')
export class TaskListsController {
  constructor(private readonly taskListService: TaskListsService) {}

  @Get()
  async findAll(@AuthUserId() userId: string): Promise<TaskList[]> {
    return this.taskListService.getAllTaskLists(userId);
  }

  @Get(':taskListId')
  async findOne(
    @AuthUserId() userId: string,
    @Param('taskListId') taskListId: string,
  ): Promise<TaskList> {
    return this.taskListService.getTaskList(taskListId, userId);
  }

  @Post()
  async create(
    @AuthUserId() userId: string,
    @Body() createTaskList: CreateTaskListRequest,
  ): Promise<TaskList> {
    return this.taskListService.createTaskList(createTaskList, userId);
  }

  @Put(':taskListId')
  async update(
    @AuthUserId() userId: string,
    @Param('taskListId') taskListId: string,
    @Body() updateTaskList: UpdateTaskListRequest,
  ): Promise<TaskList> {
    return this.taskListService.updateTaskList(
      taskListId,
      updateTaskList,
      userId,
    );
  }

  @Delete(':taskListId')
  async remove(
    @AuthUserId() userId: string,
    @Param('taskListId') taskListId: string,
  ): Promise<void> {
    return this.taskListService.deleteTaskList(taskListId, userId);
  }

  @Post(':taskListId')
  async createTask(
    @AuthUserId() userId: string,
    @Param('taskListId') taskListId: string,
    @Body() task: CreateTaskRequest,
  ): Promise<TaskResponse> {
    return this.taskListService.createTask(taskListId, task, userId);
  }

  @Put(':taskListId/:taskId')
  async updateTask(
    @AuthUserId() userId: string,
    @Param('taskListId') taskListId: string,
    @Param('taskId') taskId: string,
    @Body() task: UpdateTaskRequest,
  ): Promise<TaskResponse> {
    return this.taskListService.updateTask(taskListId, taskId, task, userId);
  }

  @Delete(':taskListId/:taskId')
  async deleteTask(
    @AuthUserId() userId: string,
    @Param('taskListId') taskListId: string,
    @Param('taskId') taskId: string,
  ): Promise<void> {
    return this.taskListService.deleteTask(taskListId, taskId, userId);
  }
}
