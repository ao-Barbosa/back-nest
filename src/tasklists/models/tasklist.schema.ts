import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../../auth/models/user.schema';
import { BaseSchema } from 'src/models/BaseSchema';

export type TaskListDocument = HydratedDocument<TaskList>;

@Schema()
export class Task extends BaseSchema {
  @Prop({ required: [true, 'É obrigatório dar um nome à tarefa.'] })
  name: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: true })
  completed: boolean;
}

export const TaskSchema = SchemaFactory.createForClass(Task).pre(
  'save',
  function (next) {
    this.updatedAt = new Date();
    next();
  },
);

@Schema()
export class TaskList extends BaseSchema {
  @Prop({
    required: [true, 'É obrigatório dar um nome à lista de tarefas.'],
    validate: {
      validator: uniqueTaskListNamesValidator,
      message: 'Não é possível salvar uma lista de tarefas com nome repetido.',
    },
  })
  name: string;

  @Prop({
    required: false,
    maxlength: [255, 'A descrição não deve passar de 255 caracteres.'],
  })
  description: string;

  @Prop({
    required: false,
    type: [TaskSchema],
    validate: [uniqueTaskNamesValidator, 'Tasks names must be unique'],
  })
  tasks: Task[];

  @Prop({ required: true, ref: 'User', type: mongoose.Schema.Types.ObjectId })
  user: User;
}

function uniqueTaskNamesValidator(tasks: Task[]): boolean {
  const taskNames = tasks.map((task) => task.name);
  return taskNames.length === new Set(taskNames).size;
}

async function uniqueTaskListNamesValidator(value: string) {
  const taskList = await this.$model('TaskList').findOne({
    name: value,
    user: this.user,
  });
  return !taskList;
}

export const TaskListSchema = SchemaFactory.createForClass(TaskList).pre(
  'save',
  function (next) {
    this.updatedAt = new Date();
    next();
  },
);
