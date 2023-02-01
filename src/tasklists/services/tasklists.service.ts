import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskList } from '../models/tasklist.entity';

// import { ObjectID } from 'typeorm';

import {
  CreateTaskListRequest,
  TaskListResponse,
  UpdateTaskListRequest,
} from '../models/tasklist.dto';
import {
  CreateTaskRequest,
  TaskResponse,
  UpdateTaskRequest,
} from '../models/task.dto';

@Injectable()
export class TaskListsService {
  private readonly logger = new Logger('TaskList');

  constructor(
    @InjectRepository(TaskList)
    private readonly taskListRepository: Repository<TaskList>,
  ) {}

  async getAll(userId: string): Promise<TaskListResponse[]> {
    const tasks = await this.taskListRepository.find({
      where: { userId },
      order: {
        name: 'ASC',
      },
    });

    this.logger.debug(`Buscando TaskLists para ${userId}`);

    return tasks.map(
      (task) =>
        new TaskListResponse({
          _id: task._id,
          name: task.name,
          description: task.description,
          tasks: task.tasks,
          userId: task.userId,
        }),
    );
  }

  async getById(tasklistId: string, userId: string): Promise<TaskListResponse> {
    this.logger.log('searching for: ' + tasklistId);
    const taskList = await this.taskListRepository.findOneBy({
      _id: tasklistId,
    });
    this.logger.log('found: ' + JSON.stringify(taskList));
    this.logger.log('user: ' + userId);
    if (!taskList) {
      throw new HttpException(
        'Lista de tarefas não encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    if (taskList.userId != userId) {
      throw new HttpException(
        'Lista de tarefas não encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    this.logger.debug(`Buscando TaskList ${taskList._id} para ${userId}`);

    return new TaskListResponse({
      _id: taskList._id,
      name: taskList.name,
      description: taskList.description,
      tasks: taskList.tasks,
      userId: taskList.userId,
    });
  }

  async create(
    tasklist: CreateTaskListRequest,
    userId: string,
  ): Promise<TaskListResponse> {
    const found = await this.taskListRepository.findOne({
      where: {
        name: tasklist.name,
        userId: userId,
      },
    });

    if (!!found) {
      throw new HttpException(
        'Já existe uma lista de tarefas com este nome',
        HttpStatus.CONFLICT,
      );
    }

    this.logger.debug(`Criando TaskList ${tasklist.name} para ${userId}`);
    const created = await this.taskListRepository.save({
      ...tasklist,
      userId: userId,
    });
    this.logger.debug(
      `TaskList ${tasklist.name} (${created._id}) criada para ${userId}`,
    );
    const response = new TaskListResponse({
      _id: created._id,
      name: created.name,
      description: created.description,
      userId: created.userId,
      tasks: created.tasks,
    });

    return response;
  }

  async update(
    tasklistId: string,
    tasklist: UpdateTaskListRequest,
    userId: string,
  ): Promise<TaskListResponse> {
    const found = await this.taskListRepository.findOne({
      where: { _id: tasklistId },
    });

    if (!found) {
      throw new HttpException(
        'Lista de tarefas não encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    if (found.userId != userId) {
      throw new HttpException(
        'Você não tem permissão para fazer isso',
        HttpStatus.FORBIDDEN,
      );
    }

    this.logger.debug(`Atualizando TaskList ${found._id} para ${userId}`);
    const response = await this.taskListRepository.save({
      ...found,
      ...tasklist,
    });
    this.logger.debug(`TaskList ${response._id} atualizada para ${userId}`);

    return new TaskListResponse({
      _id: response._id,
      name: response.name,
      description: response.description,
      userId: response.userId,
      tasks: response.tasks,
    });
  }

  async remove(tasklistId: string, userId: string): Promise<void> {
    const found = await this.taskListRepository.findOne({
      where: { _id: tasklistId },
    });

    if (!found) {
      throw new HttpException(
        'Lista de tarefas não encontrada',
        HttpStatus.NOT_FOUND,
      );
    }
    if (found.userId != userId) {
      throw new HttpException(
        'Você não tem permissão para fazer isso',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.taskListRepository.delete(tasklistId);

    return;
  }

  async createTask(
    tasklistId: string,
    task: CreateTaskRequest,
    userId: string,
  ): Promise<TaskResponse> {
    const foundTl = await this.taskListRepository.findOneBy({
      _id: tasklistId,
    });

    if (!foundTl) {
      throw new HttpException(
        'Lista de tarefas não encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    if (foundTl.userId != userId) {
      throw new HttpException(
        'Lista de tarefas não encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    if (foundTl.tasks.some((t) => t.name == task.name)) {
      throw new HttpException(
        'Já existe uma tarefa com este nome',
        HttpStatus.CONFLICT,
      );
    }

    const nTask = new Task(task.name, task.description, task.completed);

    foundTl.tasks.push(nTask);

    await this.taskListRepository.save(foundTl);

    return new TaskResponse({
      ...nTask,
    });
  }

  async updateTask(
    tasklistId: string,
    taskId: string,
    task: UpdateTaskRequest,
    userId: string,
  ): Promise<TaskResponse> {
    const foundTl = await this.taskListRepository.findOneBy({
      _id: tasklistId,
    });

    if (!foundTl) {
      throw new HttpException(
        'Lista de tarefas não encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    if (foundTl.userId != userId) {
      throw new HttpException(
        'Lista de tarefas não encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    const tIndex = foundTl.tasks.findIndex((t) => t._id == taskId);

    if (tIndex == -1) {
      throw new HttpException('Tarefa não encontrada', HttpStatus.CONFLICT);
    }

    foundTl.tasks[tIndex] = { ...foundTl.tasks[tIndex], ...task };

    await this.taskListRepository.save(foundTl);

    return new TaskResponse({
      ...foundTl.tasks[tIndex],
    });
  }

  async removeTask(
    tasklistId: string,
    taskId: string,
    userId: string,
  ): Promise<void> {
    const foundTl = await this.taskListRepository.findOneBy({
      _id: tasklistId,
    });

    if (!foundTl) {
      throw new HttpException(
        'Lista de tarefas não encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    if (foundTl.userId != userId) {
      throw new HttpException(
        'Lista de tarefas não encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    const tIndex = foundTl.tasks.findIndex((t) => t._id == taskId);

    if (tIndex == -1) {
      throw new HttpException('Tarefa não encontrada', HttpStatus.CONFLICT);
    }

    foundTl.tasks.splice(tIndex, 1);

    await this.taskListRepository.save(foundTl);

    return;
  }
}
