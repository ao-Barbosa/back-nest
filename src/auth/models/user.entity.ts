import { BaseEntityModel } from 'src/models/BaseEntity';
import { Column, Entity, Index } from 'typeorm';

@Entity('users')
export class User extends BaseEntityModel {
  @Column()
  name: string;

  @Column()
  @Index()
  email: string;

  @Column()
  password: string;
}
