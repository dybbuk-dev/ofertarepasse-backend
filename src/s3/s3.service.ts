import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
} from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  private region: string;
  private s3: S3Client;

  constructor() {
    this.region = process.env.S3_REGION;
    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        secretAccessKey: process.env.S3_SECRET_KEY,
        accessKeyId: process.env.S3_KEY,
      },
    });
  }

  async uploadFiles(files: Express.Multer.File[]) {
    const bucket = process.env.S3_BUCKET;
    const keys = [];

    for (const item of files) {
      const input: PutObjectCommandInput = {
        Body: item.buffer,
        Bucket: bucket,
        Key: randomUUID(),
        ContentType: item.mimetype,
        ACL: 'public-read',
      };

      try {
        const response: PutObjectCommandOutput = await this.s3.send(
          new PutObjectCommand(input),
        );

        if (response.$metadata.httpStatusCode === 200) {
          keys.push(input.Key);
        } else {
          throw new Error('Image not saved to s3!');
        }
      } catch (err) {
        throw err;
      }
    }

    return keys;
  }

  async deleteFiles(files: string[]) {
    const bucket = process.env.S3_BUCKET;

    for (const key of files) {
      const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      });

      try {
        const response: DeleteObjectCommandOutput = await this.s3.send(command);

        if (response.$metadata.httpStatusCode !== 204) {
          throw new Error('Erro deleting images');
        }
      } catch (err) {
        throw err;
      }
    }
  }
}
