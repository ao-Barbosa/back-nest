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
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUserId } from 'src/auth/decorators/AuthUser';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  CreateTaskRequest,
  TaskResponse,
  UpdateTaskRequest,
} from './models/task.dto';
import {
  CreateTaskListRequest,
  TaskListResponse,
  UpdateTaskListRequest,
} from './models/tasklist.dto';
import { TaskListsService } from './services/tasklists.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('TaskList')
@Controller('tasklists')
export class TaskListsController {
  constructor(private readonly taskListsService: TaskListsService) {}

  @Get()
  @ApiOkResponse({
    description: 'Busca de tarefas',
    type: [TaskListResponse],
  })
  async getAll(@AuthUserId() userId: string): Promise<TaskListResponse[]> {
    return await this.taskListsService.getAll(userId);
  }

  @Post()
  @ApiCreatedResponse({
    description: 'Lista de tarefas criada',
    type: TaskListResponse,
  })
  async create(
    @Body() body: CreateTaskListRequest,
    @AuthUserId() userId: string,
  ): Promise<TaskListResponse> {
    return await this.taskListsService.create(body, userId);
  }

  @Get(':tasklistId')
  @ApiOkResponse({
    description: 'Busca de tarefa por ID',
    type: TaskListResponse,
  })
  async getById(
    @Param('tasklistId') tasklistId: string,
    @AuthUserId() userId: string,
  ): Promise<TaskListResponse> {
    return await this.taskListsService.getById(tasklistId, userId);
  }

  @Put(':tasklistId')
  @ApiOkResponse({
    description: 'Atualização de tarefa por ID',
    type: TaskListResponse,
  })
  async update(
    @Param('tasklistId') tasklistId: string,
    @Body() tasklist: UpdateTaskListRequest,
    @AuthUserId() userId: string,
  ): Promise<TaskListResponse> {
    return await this.taskListsService.update(tasklistId, tasklist, userId);
  }

  @Delete(':tasklistId')
  @ApiAcceptedResponse({
    description: 'Remoção de tarefa por ID',
  })
  async remove(
    @Param('tasklistId') tasklistId: string,
    @AuthUserId() userId: string,
  ): Promise<void> {
    return await this.taskListsService.remove(tasklistId, userId);
  }

  @Post(':tasklistId/task')
  @ApiCreatedResponse({
    description: 'Tarefa criada',
  })
  async createTask(
    @Param('tasklistId') tasklistId: string,
    @Body() task: CreateTaskRequest,
    @AuthUserId() userId: string,
  ): Promise<TaskResponse> {
    return await this.taskListsService.createTask(tasklistId, task, userId);
  }

  @Put(':tasklistId/task/:taskId')
  @ApiOkResponse({
    description: 'Tarefa atualizada',
  })
  async updateTask(
    @Param('tasklistId') tasklistId: string,
    @Param('taskId') taskId: string,
    @Body() task: UpdateTaskRequest,
    @AuthUserId() userId: string,
  ): Promise<TaskResponse> {
    return await this.taskListsService.updateTask(
      tasklistId,
      taskId,
      task,
      userId,
    );
  }

  @Delete(':tasklistId/task')
  @ApiOkResponse({
    description: 'Tarefa removida',
  })
  async removeTask(
    @Param('tasklistId') tasklistId: string,
    @Param('taskId') taskId: string,
    @AuthUserId() userId: string,
  ): Promise<void> {
    return await this.taskListsService.removeTask(tasklistId, taskId, userId);
  }
}
