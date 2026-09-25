
import {getSignedUrl} from "@aws-sdk/s3-request-presigner"
import {DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3"

import {requireEnv} from "../utils/env.js"

export type UploadTarget = {fileName: string; uploadUrl: string}

export class R2Bucket {
	readonly #bucket = requireEnv("R2_BUCKET_APAC")
	readonly #client = new S3Client({
		region: "auto",
		endpoint: `https://${requireEnv("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
		forcePathStyle: true,
		requestChecksumCalculation: "WHEN_REQUIRED",
		credentials: {
			accessKeyId: requireEnv("R2_ACCESS_KEY_ID_APAC"),
			secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY_APAC"),
		},
	})

	async createUploadTarget(fileName: string): Promise<UploadTarget> {
		const uploadUrl = await getSignedUrl(this.#client, new PutObjectCommand({
			Bucket: this.#bucket,
			Key: fileName,
		}), {expiresIn: 600})
		return {fileName, uploadUrl}
	}

	downloadUrl(fileName: string) {
		return getSignedUrl(this.#client, new GetObjectCommand({
			Bucket: this.#bucket,
			Key: fileName,
		}), {expiresIn: 3600})
	}

	async delete(fileName: string) {
		await this.#client.send(new DeleteObjectCommand({
			Bucket: this.#bucket,
			Key: fileName,
		}))
	}
}

