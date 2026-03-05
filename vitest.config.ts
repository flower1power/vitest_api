import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import TelegramReporter from './packages/notifier/bot.js';

export default defineConfig({
  resolve: {
    alias: {
      '@checkers': resolve(__dirname, 'checkers'),
      '@dm_api_account': resolve(__dirname, 'clients/http/dm_api_account'),
      '@mailhog_api': resolve(__dirname, 'clients/http/mailhog_api'),
      '@fixture': resolve(__dirname, 'fixture'),
      '@helpers': resolve(__dirname, 'helpers'),
      '@notifier': resolve(__dirname, 'packages/notifier'),
      '@rest_client': resolve(__dirname, 'packages/rest_client'),
      '@service': resolve(__dirname, 'service'),
      '@steps-flows': resolve(__dirname, 'steps-flows'),
    },
  },
  test: {
    reporters: ['default', 'allure-vitest/reporter', new TelegramReporter(), ['junit', { outputFile: 'test-results/junit.xml' }]],
    setupFiles: ['allure-vitest/setup'],
    testTimeout: 60000,
    hookTimeout: 30000,
    pool: 'forks', // 'forks' | 'threads' | 'vmThreads'
    maxWorkers: 12, // максимум воркеров (число или процент '50%')
    fileParallelism: true, // параллельное выполнение файлов
  },
});
//['junit', { outputFile: 'test-results/junit.xml' }]
//vitest run  2.65s user 0.53s system 148% cpu 2.145 total
// dotenv -- vitest run  3.37s user 0.74s system 64% cpu 6.350 total
// dotenv -- npx playwright test  3.96s user 0.70s system 178% cpu 2.615 total
// dotenv -- npx playwright test  10.41s user 2.07s system 349% cpu 3.571 total
