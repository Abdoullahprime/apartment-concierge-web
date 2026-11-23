import Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3001),

  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRY: Joi.string().default('7d'),

  SUPABASE_URL: Joi.string().uri().required(),
  SUPABASE_SERVICE_KEY: Joi.string().required(),

  FRONTEND_URL: Joi.string().uri().default('http://localhost:3000'),

  // NestJS Observe (optional until linked)
  OBSERVE_APP_KEY: Joi.string().optional().allow('', 'YOUR_APP_KEY'),
  OBSERVE_APP_SECRET: Joi.string().optional().allow('', 'YOUR_APP_SECRET'),
});
