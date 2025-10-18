const { z } = require('zod');

const schema = z.object({
  APP_PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  DB_TYPE: z.enum(['sqlite', 'mysql', 'postgres']).default('sqlite'),
  SQLITE_FILE: z.string().default('./data/store.db'),

  DB_HOST: z.string().optional(),
  DB_PORT: z.coerce.number().optional(),
  DB_NAME: z.string().optional(),
  DB_USER: z.string().optional(),
  DB_PASSWORD: z.string().optional(),

  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET must be at least 32 characters')
    .default('change_this_to_a_secure_random_string_in_production'),

  PRINTER_NAME: z.string().optional(),
  PRINT_QUEUE_CONCURRENCY: z.coerce.number().default(1),
  PRINT_MAX_RETRY: z.coerce.number().default(3),
  PRINT_RETRY_DELAY_MS: z.coerce.number().default(1500),

  VITE_SUPABASE_URL: z.string().url().optional().or(z.literal('')),
  VITE_SUPABASE_ANON_KEY: z.string().optional().or(z.literal('')),
});

let cfg;

try {
  cfg = schema.parse(process.env);
} catch (error) {
  console.error('Configuration validation failed:');
  if (error.errors) {
    error.errors.forEach((err) => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`);
    });
  }
  console.error('\nPlease check your .env file and ensure all required variables are set.');
  process.exit(1);
}

module.exports = { cfg };
