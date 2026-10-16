import * as z from "zod"

export const projectSettingsSchema = z.strictObject({
	resolution: z.string().regex(/^[1-9]\d*x[1-9]\d*$/).describe("Canvas dimensions in pixels, for example 1920x1080 or 1080x1920."),
	timebase: z.number().positive().describe("Project frame rate in frames per second, for example 23.98, 24, 25, 29.97, 30 or 60."),
	dropFrame: z.boolean(),
	aspectRatio: z.enum(["16:9", "9:16", "1:1", "3:2", "4:3", "21:9"]),
	colorSpace: z.enum(["rec709", "display-p3", "rec2020"]),
	sampleRate: z.enum(["48000", "44100", "96000"]),
	channels: z.enum(["stereo", "mono", "5.1"]),
})

export type Settings = z.infer<typeof projectSettingsSchema>

export const projectSettingsUpdateParameters = projectSettingsSchema.partial()
	.refine(settings => Object.keys(settings).length > 0, "Provide at least one setting to change.")

export type ProjectSettingsUpdate = z.infer<typeof projectSettingsUpdateParameters>
