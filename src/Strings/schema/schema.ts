import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AnalyzedStringDocument = AnalyzedString & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: false } })
export class AnalyzedString {
  @Prop({ required: true, unique: true })
  _id: string;

  @Prop({ required: true })
  value: string;

  @Prop({ required: true, type: Number })
  length: number;

  @Prop({ required: true, type: Boolean })
  is_palindrome: boolean;

  @Prop({ required: true, type: Number })
  unique_characters: number;

  @Prop({ required: true, type: Number })
  word_count: number;

  @Prop({ required: true })
  sha256_hash: string;

  @Prop({ required: true, type: Object })
  character_frequency_map: Record<string, number>;

  @Prop({ required: true })
  created_at: Date;
}

export const AnalyzedStringSchema =
  SchemaFactory.createForClass(AnalyzedString);

AnalyzedStringSchema.set('toJSON', {
  transform: (_doc, ret: any) => {
    ret.id = ret._id;
    delete ret.__v;
    return ret;
  },
});
