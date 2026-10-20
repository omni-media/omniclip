import * as z from "zod"

// Project IDs use hex.random(16): 16 bytes (128 bits) encoded as 32 hex characters.
export const projectId = z.hex().length(32)
export const projectSession = z.object({projectId})
export type ProjectSession = z.infer<typeof projectSession>
