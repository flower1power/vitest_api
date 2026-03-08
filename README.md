# API Vitest

Фреймворк для API-тестирования на базе Vitest для тестирования сервиса DM Account API.

## Требования

- [Bun](https://bun.sh) >= 1.3.0
- Docker (опционально)

## Установка

```bash
bun install
```

## Настройка

Создайте файл `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

Обязательные переменные:
- `DM_API_URL` — URL API сервиса
- `MAILHOG_URL` — URL MailHog для проверки email
- `AUTH_USER_LOGIN`, `AUTH_USER_PASSWORD` — учётные данные для авторизованных тестов

Опциональные:
- `TELEGRAM_BOT_ACCESS_TOKEN`, `TELEGRAM_BOT_CHAT_ID` — для уведомлений в Telegram
- `WORKERS` — количество параллельных воркеров (по умолчанию 4)

## Запуск тестов

### Локально

```bash
# Все тесты
bun test

# Конкретный файл
bun dotenv -- vitest run tests/smoke/post_v1_account/post_v1_account.spec.ts

# По паттерну имени
bun dotenv -- vitest run -t "Проверка регистрации"
```

### Docker

```bash
# Запуск тестов
docker-compose run --rm tests

# С указанием количества воркеров
WORKERS=8 docker-compose run --rm tests

# Генерация Allure-отчёта
docker-compose run --rm report
```

## Структура проекта

```
├── clients/http/          # API-клиенты
│   ├── dm_api_account/    # Клиент DM Account API
│   └── mailhog_api/       # Клиент MailHog
├── lib/
│   ├── rest_client/       # Базовый HTTP-клиент
│   └── notifier/          # Telegram-репортер
├── helpers/               # Высокоуровневые хелперы
├── fixture/               # Vitest-фикстуры и матчеры
├── checkers/              # Валидаторы ответов
├── service/               # Агрегация сервисов
├── steps-flows/           # Allure-декораторы
├── tests/
│   ├── smoke/             # Smoke-тесты
│   └── regression/        # Регрессионные тесты
└── config/                # Конфигурация
```

## Docker

Используется multi-stage build для оптимизации размера образов:

| Stage   | Размер | Назначение                    |
|---------|--------|-------------------------------|
| tests   | ~789MB | Запуск тестов (Bun)           |
| report  | ~1.1GB | Генерация отчётов (Java/Allure) |

## Линтинг

```bash
bunx eslint .
```