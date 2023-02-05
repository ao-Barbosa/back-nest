import { Prop, Schema } from '@nestjs/mongoose';
import { Document, Schema as mSchema } from 'mongoose';

@Schema()
export class BaseSchema extends Document {
  _id: mSchema.Types.ObjectId;

  @Prop({ default: new Date() })
  createdAt: Date = new Date();

  @Prop({ default: new Date() })
  updatedAt: Date = new Date();
}
