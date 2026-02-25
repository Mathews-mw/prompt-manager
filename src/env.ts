import { z } from 'zod';
import { createEnv } from '@t3-oss/env-nextjs';

export const env = createEnv({
	server: {
		NODE_ENV: z.enum(['development', 'qas', 'production']).default('development'),
		DATABASE_URL: z.string(),
	},
	client: {
		NEXT_PUBLIC_API_BASE_URL: z.string(),
	},

	runtimeEnv: {
		NODE_ENV: process.env.NODE_ENV,
		DATABASE_URL: process.env.DATABASE_URL,
		NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
	},
});
