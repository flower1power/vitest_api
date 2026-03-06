function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Переменная окружения ${name} не задана`);
  }
  return value;
}

function optionalEnv(name: string, defaultValue: string): string {
  return process.env[name] ?? defaultValue;
}

export const config = {
  dmApi: {
    url: requiredEnv('DM_API_URL'),
  },
  mailhog: {
    url: requiredEnv('MAILHOG_URL'),
  },
  telegram: {
    token: process.env.TELEGRAM_BOT_ACCESS_TOKEN,
    chatId: process.env.TELEGRAM_BOT_CHAT_ID,
  },
  test: {
    timeout: Number(optionalEnv('TEST_TIMEOUT', '60000')),
    hookTimeout: Number(optionalEnv('HOOK_TIMEOUT', '30000')),
    maxWorkers: Number(optionalEnv('MAX_WORKERS', '12')),
  },
  report: {
    env: optionalEnv('REPORT_ENV', 'local'),
    project: optionalEnv('PROJECT', 'api_vitest'),
    workers: optionalEnv('WORKERS', '1'),
    pipelineUrl: process.env.CI_PIPELINE_URL,
  },
} as const;
