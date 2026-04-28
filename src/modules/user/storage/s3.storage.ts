import { randomUUID } from "node:crypto"
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { config } from "../../../config/env.config"
import { getSignedUrl as awsGetSignedUrl } from "@aws-sdk/s3-request-presigner"

export interface UploadFile {
  buffer: Buffer
  mimetype: string
  originalName: string
  size: number
}

export class S3Storage {
  private s3: S3Client
  private bucket: string
  private region: string

  constructor() {
    // Use central config so env var names stay consistent
    this.bucket = config.aws.s3.bucketName
    this.region = config.aws.region
    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey,
      }
    })
  }

  async uploadProfileImage(file: UploadFile, userId: number): Promise<string> {
    const key = `notes-app-profiles/${userId}/${randomUUID()}`

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype
      })
    )

    return key
  }

  async deleteImage(key: string): Promise<void> {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key
      })
    )
  }

  async getSignedUrl(key: string, expiresInSeconds: number): Promise<string> {
    // Generate a signed URL for reading (GET) an existing object
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key
    })
    return awsGetSignedUrl(this.s3, command, { expiresIn: expiresInSeconds })
  }

  getPublicUrl(key: string): string {
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`
  }
}

// Export a singleton instance
export const s3Storage = new S3Storage()
