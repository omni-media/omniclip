
import {getSignedUrl} from "@aws-sdk/s3-request-presigner"
import {DeleteObjectsCommand, GetObjectCommand, NoSuchKey, PutObjectCommand, S3Client} from "@aws-sdk/client-s3"

import {requireEnv} from "../utils/env.js"

export type UploadTarget = {uploadUrl: string}

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
		}), {expiresIn: 3600})
		return {uploadUrl}
	}

	downloadUrl(fileName: string) {
		return getSignedUrl(this.#client, new GetObjectCommand({
			Bucket: this.#bucket,
			Key: fileName,
		}), {expiresIn: 3600})
	}

	async getJson<Value>(fileName: string): Promise<Value | undefined> {
		try {
			const result = await this.#client.send(new GetObjectCommand({
				Bucket: this.#bucket,
				Key: fileName,
			}))
			return JSON.parse(await result.Body!.transformToString()) as Value
		}
		catch (error) {
			if (error instanceof NoSuchKey)
				return
			throw error
		}
	}

	async deleteMany(fileNames: string[]) {
		if (!fileNames.length) return
		const result = await this.#client.send(new DeleteObjectsCommand({
			Bucket: this.#bucket,
			Delete: {Objects: fileNames.map(Key => ({Key})), Quiet: true},
		}))
		if (result.Errors?.length)
			throw new Error(`Could not delete ${result.Errors.length} temporary uploads`)
	}
}

