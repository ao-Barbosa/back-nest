import { BaseEntityModel } from 'src/models/BaseEntity';
import { Column, Entity } from 'typeorm';

export class Task extends BaseEntityModel {
  @Column({ nullable: false })
  name: string;

  @Column()
  description: string;

  @Column()
  completed: boolean;

  constructor(name: string, description: string, completed = false) {
    super();
    this.name = name;
    this.description = description;
    this.completed = completed;
  }
}

@Entity('tasklists')
export class TaskList extends BaseEntityModel {
  @Column({ nullable: false })
  name: string;

  @Column()
  description: string;

  @Column(() => Task)
  tasks: Task[];

  @Column()
  userId: string;
}
