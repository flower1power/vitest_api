import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import TelegramReporter from './lib/notifier/bot.js';

export default defineConfig({
  resolve: {
    alias: {
      '@checkers': resolve(__dirname, 'checkers'),
      '@config': resolve(__dirname, 'config'),
      '@dm_api_account': resolve(__dirname, 'clients/http/dm_api_account'),
      '@mailhog_api': resolve(__dirname, 'clients/http/mailhog_api'),
      '@fixture': resolve(__dirname, 'fixture'),
      '@helpers': resolve(__dirname, 'helpers'),
      '@notifier': resolve(__dirname, 'lib/notifier'),
      '@rest_client': resolve(__dirname, 'lib/rest_client'),
      '@service': resolve(__dirname, 'service'),
      '@steps-flows': resolve(__dirname, 'steps-flows'),
    },
  },
  ssr: {
    noExternal: ['zod'],
  },
  test: {
    reporters: ['default', 'allure-vitest/reporter', new TelegramReporter(), ['junit', { outputFile: 'test-results/junit.xml' }]],
    setupFiles: ['allure-vitest/setup'],
    testTimeout: 60000,
    hookTimeout: 30000,
    pool: 'forks',
    maxWorkers: 12,
    fileParallelism: true,
    exclude: ['**/node_modules/**', '**/.github/**'],
  },
});
