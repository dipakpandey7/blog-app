import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  authorId: mongoose.Types.ObjectId;
  publishDate: Date;
  lastUpdated: Date;
  category: string[];
  featuredImage: string;
}

const PostSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  publishDate: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
  category: [{ type: String }],
  featuredImage: { type: String },
});

export default mongoose.model<IPost>('Post', PostSchema);