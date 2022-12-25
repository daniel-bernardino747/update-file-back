import aws from 'aws-sdk';
import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import { promisify } from 'util';

const s3 = new aws.S3();

const PostSchema = new mongoose.Schema({
  name: String,
  size: Number,
  key: String,
  url: String,
  createAt: {
    type: Date,
    default: Date.now,
  },
});

PostSchema.pre('save', function() {
  if (!this.url) {
    this.url = `${process.env.APP_URL}/files/${this.key}`
  }
}) // realiza antes de salvar um arquivo

PostSchema.pre('remove', function() {
  if (process.env.STORAGE_TYPE === 's3') {
    return s3.deleteObject({
      Bucket: 'upload-files-dan-devlops',
      Key: this.key,
    }).promise()
  } else {
    return promisify(fs.unlink)(
      path.resolve('__dirname', '..', 'tmp', 'uploads', this.key)
    );
  }
})

export default mongoose.model('Post', PostSchema);
