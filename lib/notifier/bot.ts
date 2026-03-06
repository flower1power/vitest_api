import type { Reporter, TestRunEndReason } from 'vitest/reporters';
import type { TestModule } from 'vitest/node';
import { Bot } from 'grammy';

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function fmtDate(ms: number): string {
  const d = new Date(ms);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
}

function fmtDur(ms: number): string {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}:${pad(m)}:${pad(sec)}`;
}

function percent(n: number, total: number): string {
  return total ? ((n / total) * 100).toFixed(2) : '0.00';
}

class TelegramReporter implements Reporter {
  private startTime = 0;

  onInit(): void {
    this.startTime = Date.now();
  }

  async onTestRunEnd(
    testModules: readonly TestModule[],
    _unhandledErrors: readonly unknown[],
    _reason: TestRunEndReason,
  ): Promise<void> {
    let passed = 0;
    let failed = 0;
    let skipped = 0;

    for (const module of testModules) {
      for (const test of module.children.allTests()) {
        const result = test.result();
        if (result?.state === 'passed') passed++;
        else if (result?.state === 'failed') failed++;
        else if (result?.state === 'skipped') skipped++;
      }
    }

    const token = process.env.TELEGRAM_BOT_ACCESS_TOKEN;
    const chatId = process.env.TELEGRAM_BOT_CHAT_ID;

    if (!token || !chatId) {
      console.log('TelegramReporter: Skipping - TELEGRAM_BOT_ACCESS_TOKEN or TELEGRAM_BOT_CHAT_ID not set');
      return;
    }

    const bot = new Bot(token);
    const endTime = Date.now();
    const total = passed + failed + skipped;
    const isSuccess = failed === 0 && total > 0;
    const statusEmoji = isSuccess ? '✅' : '❌';

    const lines = [
      `${statusEmoji} ══════ Test Report ══════`,
      '',
      '📊 Результаты тестирования:',
      `🎮 Всего тестов: ${total}`,
      `${isSuccess ? '✅' : '❌'} Passed: ${passed} (${percent(passed, total)}%)`,
      `${failed > 0 ? '🔴' : '⚪'} Failed: ${failed} (${percent(failed, total)}%)`,
      `⏭️ Skipped: ${skipped} (${percent(skipped, total)}%)`,
      '',
      '⏱️ Время выполнения:',
      `📅 Начало: ${fmtDate(this.startTime)}`,
      `📅 Конец: ${fmtDate(endTime)}`,
      `⏳ Длительность: ${fmtDur(endTime - this.startTime)}`,
      '',
      '🔧 Конфигурация:',
      `▪️ Environment: ${process.env.REPORT_ENV ?? 'local'}`,
      `▪️ Project: ${process.env.PROJECT ?? 'api\\_vitest'}`,
      `▪️ Workers: ${process.env.WORKERS ?? '1'}`,
      '',
      '🔗 Ссылки:',
      `📊 Отчет: https://flower1power.github.io/vitest_api/`,
    ];

    if (process.env.CI_PIPELINE_URL) {
      lines.push(`🔄 Pipeline: ${process.env.CI_PIPELINE_URL}`);
    }

    lines.push('', `${statusEmoji} Статус: ${isSuccess ? 'PASSED' : 'FAILED'}`);

    try {
      await bot.api.sendMessage(chatId, lines.join('\n'));
      console.log('TelegramReporter: Notification sent');
    } catch (error) {
      console.error('TelegramReporter: Failed to send:', error);
    }
  }
}

export default TelegramReporter;
