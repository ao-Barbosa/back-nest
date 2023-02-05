import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TaskList } from '../models/tasklist.schema';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateTaskListRequest,
  UpdateTaskListRequest,
} from '../models/tasklist.dto';
import {
  CreateTaskRequest,
  TaskResponse,
  UpdateTaskRequest,
} from '../models/task.dto';

@Injectable()
export class TaskListsService {
  constructor(
    @InjectModel('TaskList') private taskListModel: Model<TaskList>,
  ) {}

  async getAllTaskLists(userId: string): Promise<TaskList[]> {
    const taskLists = await this.taskListModel
      .find({ user: userId })
      .select('-tasks')
      .exec();

    return taskLists;
  }

  async getTaskList(taskListId: string, userId: string): Promise<TaskList> {
    const taskList = await this.taskListModel
      .findOne({ _id: taskListId, user: userId })
      .exec();
    if (!taskList) {
      throw new HttpException(
        'Lista de tarefas não encontrada.',
        HttpStatus.NOT_FOUND,
      );
    }
    return taskList;
  }

  async createTaskList(
    taskList: CreateTaskListRequest,
    userId: string,
  ): Promise<TaskList> {
    const createdTaskList = new this.taskListModel({
      ...taskList,
      user: userId,
    });
    await createdTaskList.save();
    return createdTaskList;
  }

  async updateTaskList(
    taskListId: string,
    taskList: UpdateTaskListRequest,
    userId: string,
  ): Promise<TaskList> {
    const updatedTaskList = await this.taskListModel.findOneAndUpdate(
      { _id: taskListId, user: userId },
      { $set: taskList },
      { new: true, runValidators: true },
    );
    if (!updatedTaskList) {
      throw new HttpException(
        'Lista de tarefas não encontrada.',
        HttpStatus.NOT_FOUND,
      );
    }
    return updatedTaskList;
  }

  async deleteTaskList(taskListId: string, userId: string): Promise<void> {
    const deletedTaskList = await this.taskListModel.findOneAndDelete({
      _id: taskListId,
      user: userId,
    });
    if (!deletedTaskList) {
      throw new HttpException(
        'Lista de tarefas não encontrada.',
        HttpStatus.NOT_FOUND,
      );
    }
    return;
  }

  async createTask(
    taskListId: string,
    task: CreateTaskRequest,
    userId: string,
  ): Promise<TaskResponse> {
    const nTask = {
      ...task,
      user: userId,
      _id: undefined,
    };

    const updatedTaskList = await this.taskListModel.findOneAndUpdate(
      {
        _id: taskListId,
        user: userId,
      },
      {
        $push: { tasks: nTask },
      },
      { new: true, runValidators: true },
    );

    if (!updatedTaskList) {
      throw new HttpException(
        'Lista de tarefas não encontrada.',
        HttpStatus.NOT_FOUND,
      );
    }

    return updatedTaskList.tasks[updatedTaskList.tasks.length - 1];
  }

  async updateTask(
    taskListId: string,
    taskId: string,
    task: UpdateTaskRequest,
    userId: string,
  ): Promise<TaskResponse> {
    const updatedTaskList = await this.taskListModel.findOneAndUpdate(
      {
        _id: taskListId,
        user: userId,
        'tasks._id': taskId,
      },
      {
        $set: { 'tasks.$': task },
      },
      { new: true, runValidators: true },
    );

    if (!updatedTaskList) {
      throw new HttpException('Tarefa não encontrada.', HttpStatus.NOT_FOUND);
    }

    return updatedTaskList.tasks[updatedTaskList.tasks.length - 1];
  }

  async deleteTask(
    taskListId: string,
    taskId: string,
    userId: string,
  ): Promise<void> {
    const updatedTaskList = await this.taskListModel.findOneAndUpdate(
      {
        _id: taskListId,
        user: userId,
      },
      {
        $pull: { tasks: { _id: taskId } },
      },
      { new: true, runValidators: true },
    );

    if (!updatedTaskList) {
      throw new HttpException('Tarefa não encontrada.', HttpStatus.NOT_FOUND);
    }

    return;
  }
}
