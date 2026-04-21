import { UserRepository } from "./user.repository"
import { UserProfileUpload } from "./user.type"
import { S3Storage } from "./storage/s3.storage"

export class UserService {

  constructor(
    private readonly repo: UserRepository,
    private readonly storage: S3Storage
  ) {}

  async updateAvatar({ userId, file }: UserProfileUpload): Promise<string> {
    if (!file) throw new Error("No file")

    // Ensure file has originalName property for UploadFile compatibility
    const uploadFile = {
      ...file,
      originalName: (file as any).originalName || (file as any).name || "unknown"
    };

    const user = await this.repo.findById(userId)
    if (!user) throw new Error("User not found")

    if (user.profile_pic_url) {
      await this.storage.deleteImage(user.profile_pic_url)
    }

    const key = await this.storage.uploadProfileImage(uploadFile, userId)
    await this.repo.updateProfilePicUrl(userId, key)

    // Return a 24-hour signed URL that the client can use directly
    const signedUrl = await this.storage.getSignedUrl(key, 24 * 60 * 60)
    return signedUrl
  }
}


