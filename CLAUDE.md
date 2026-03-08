# CLAUDE.md

Этот файл содержит инструкции для Claude Code (claude.ai/code) при работе с кодом в этом репозитории.

## Команды

### Локальный запуск

```bash
# Установка зависимостей
bun install

# Запуск всех тестов (требуется .env файл с переменными окружения)
bun test

# Запуск одного тестового файла
bun dotenv -- vitest run tests/smoke/post_v1_account/post_v1_account.spec.ts

# Запуск тестов по паттерну имени
bun dotenv -- vitest run -t "Проверка регистрации"

# Линтинг кода
bunx eslint .
```

### Docker

```bash
# Запуск тестов в Docker
docker-compose run --rm tests

# Генерация Allure-отчёта
docker-compose run --rm report

# Пересборка образов
docker-compose build --no-cache
```

Docker использует multi-stage build:
- `tests` (789MB) — лёгкий образ только для запуска тестов
- `report` (1.14GB) — с Java/Allure для генерации отчётов

## Архитектура

Фреймворк для API-тестирования на базе Vitest для тестирования сервиса DM Account API.

### Структура слоёв

**lib/rest_client/** - Базовая инфраструктура HTTP-клиента
- `RestClient` - HTTP-клиент на базе Axios с логированием запросов/ответов и генерацией cURL
- `ApiResponse` - Обёртка ответа со встроенными проверками (`toHaveStatusCode`, `toMatchSchema`, `checkError`)
- `Configuration` - Конфигурация хоста и заголовков

**clients/http/** - API-клиенты, организованные по сервисам
- `dm_api_account/apis/` - Классы Account и Login API, наследующие `RestClient`
- `dm_api_account/models/` - DTO и Zod-схемы для валидации запросов/ответов
- `mailhog_api/` - Клиент MailHog API для проверки email в тестах

**service/** - Слой агрегации сервисов
- `ApiDmAccount` - Объединяет AccountApi и LoginApi в единый сервисный клиент
- `ApiMailhog` - Сервисный клиент MailHog

**helpers/** - Высокоуровневые хелперы для тестов
- `AccountHelpers` - Бизнес-операции (регистрация, логин, сброс пароля, смена email) с логикой повторных попыток

**checkers/** - Валидаторы ответов для конкретных эндпоинтов

**fixture/** - Vitest-фикстуры и кастомные матчеры
- Расширенный `test` с фикстурами: `accountClient`, `mailhogClient`, `accountHelper`, `authAccountHelper`, `prepareUser`
- Кастомные матчеры: `toHaveStatusCode`, `toMatchSchemaAPI`, `checkErrorBody`, `toHaveHeader`

**steps-flows/** - Декоратор шагов Allure для отчётности
- Декоратор `@Step('описание')` оборачивает методы как шаги Allure

**lib/notifier/** - Telegram-репортер для уведомлений о результатах тестов

### Организация тестов

Тесты находятся в `tests/`, организованы по типу (`smoke/`, `regression/`) и имени эндпоинта. Каждый тестовый файл использует фикстуры из `@fixture/index.js`.

### Алиасы путей

Настроены в `tsconfig.json` и `vitest.config.ts`:
- `@checkers/*`, `@config/*`, `@dm_api_account/*`, `@mailhog_api/*`, `@fixture/*`, `@helpers/*`, `@notifier/*`, `@rest_client/*`, `@service/*`, `@steps-flows/*`

### Конфигурация

Централизованная конфигурация в `config/index.ts`. Все настройки загружаются из переменных окружения. См. `.env.example` для списка переменных.

### Переменные окружения

Требуются в файле `.env` (загружаются через `dotenv-cli`):
- `TELEGRAM_BOT_ACCESS_TOKEN`, `TELEGRAM_BOT_CHAT_ID` - Для уведомлений о тестах
- `REPORT_ENV`, `PROJECT`, `WORKERS`, `CI_PIPELINE_URL` - Конфигурация репортера
