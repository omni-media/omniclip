import {Pool} from "pg"
import {betterAuth} from "better-auth"

import {requireEnv} from "../utils/env.js"

export const authOrigin = new URL(requireEnv("BETTER_AUTH_URL")).origin
const secret = requireEnv("BETTER_AUTH_SECRET")
if (secret.length < 32) throw new Error("BETTER_AUTH_SECRET must be at least 32 characters")
if (process.env.NODE_ENV === "production" && !authOrigin.startsWith("https://"))
	throw new Error("BETTER_AUTH_URL must use HTTPS in production")

const connectionString = process.env.DATABASE_URL
if (!connectionString)
	throw new Error("Missing DATABASE_URL. Run npm run db:env or set it in .env.")

export const database = new Pool({connectionString})
database.on("error", error => console.error("Database connection failed", error))

export const auth = betterAuth({
	appName: "Omniclip",
	baseURL: authOrigin,
	secret,
	database,
	account: {encryptOAuthTokens: true},
	rateLimit: {enabled: true, storage: "database"},
	socialProviders: {
		google: {
			clientId: requireEnv("GOOGLE_CLIENT_ID"),
			clientSecret: requireEnv("GOOGLE_CLIENT_SECRET"),
		},
	},
})
