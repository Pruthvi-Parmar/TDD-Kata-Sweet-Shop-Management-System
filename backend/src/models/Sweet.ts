import mongoose, { Document, Schema } from 'mongoose';

export interface ISweet extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const sweetSchema = new Schema<ISweet>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    imageUrl: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

sweetSchema.index({ name: 'text', description: 'text', category: 'text' });
sweetSchema.index({ category: 1 });
sweetSchema.index({ price: 1 });

export default mongoose.model<ISweet>('Sweet', sweetSchema);

