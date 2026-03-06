export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly url: string,
    public readonly method: string,
    public readonly curl: string,
    public readonly cause?: Error,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  toString(): string {
    return `[${this.code}] ${this.message}\nURL: ${this.url}\nMethod: ${this.method}\nCURL: ${this.curl}`;
  }
}

export class TimeoutError extends ApiError {
  constructor(url: string, method: string, curl: string, timeoutMs?: number, cause?: Error) {
    const message = timeoutMs ? `Превышено время ожидания ответа (${timeoutMs}ms)` : 'Превышено время ожидания ответа';
    super('TIMEOUT', message, url, method, curl, cause);
    this.name = 'TimeoutError';
  }
}

export class ConnectionError extends ApiError {
  constructor(url: string, method: string, curl: string, cause?: Error) {
    super('CONNECTION_REFUSED', `Не удалось подключиться к серверу: ${url}`, url, method, curl, cause);
    this.name = 'ConnectionError';
  }
}

export class DnsError extends ApiError {
  constructor(url: string, method: string, curl: string, hostname: string, cause?: Error) {
    super('DNS_ERROR', `Не удалось разрешить DNS для хоста: ${hostname}`, url, method, curl, cause);
    this.name = 'DnsError';
  }
}

export class NetworkError extends ApiError {
  constructor(url: string, method: string, curl: string, cause?: Error) {
    const message = cause?.message || 'Неизвестная сетевая ошибка';
    super('NETWORK_ERROR', message, url, method, curl, cause);
    this.name = 'NetworkError';
  }
}
