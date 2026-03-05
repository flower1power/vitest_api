import { randomUUID } from 'crypto';
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type Method as HttpMethod } from 'axios';
import { Configuration } from './configuration.js';
import { ApiResponse } from './api_response.js';

export interface RequestOptions {
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
  data?: unknown;
  json?: unknown;
  timeout?: number;
}

export class RestClient {
  private readonly axiosInstance: AxiosInstance;
  private readonly host: string;
  private headers: Record<string, string> = {};
  private readonly disableLog: boolean;

  constructor(configuration: Configuration) {
    this.host = configuration.host;
    this.headers = configuration.headers ?? {};
    this.disableLog = configuration.disableLog;

    this.axiosInstance = axios.create({
      baseURL: this.host,
      headers: this.headers,
      validateStatus: () => true, // Не выбрасывать исключения для не-2xx статусов
    });
  }

  setHeaders(headers: Record<string, string>): void {
    this.headers = headers;
    this.axiosInstance.defaults.headers.common = { ...headers };
  }

  async get<T = unknown>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this._sendRequest<T>('GET', path, options);
  }

  async post<T = unknown>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this._sendRequest<T>('POST', path, options);
  }

  async put<T = unknown>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this._sendRequest<T>('PUT', path, options);
  }

  async delete<T = unknown>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this._sendRequest<T>('DELETE', path, options);
  }

  private async _sendRequest<T = unknown>(
    method: HttpMethod,
    path: string,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    const eventId = randomUUID();
    const fullUrl = this._buildFullUrl(path);

    const requestHeaders = { ...this.headers, ...options.headers };

    const reqBody: unknown = options.data || options.json;

    const axiosConfig: AxiosRequestConfig = {
      method,
      url: path,
      params: options.params,
      headers: requestHeaders,
      data: reqBody,
      timeout: options.timeout,
    };

    const curl = this._toCurl(method, fullUrl, requestHeaders, reqBody);

    if (this.disableLog) {
      console.log(curl);

      const response = await this.axiosInstance.request<T>(axiosConfig);

      return this._createApiResponse<T>(response, reqBody, curl);
    }

    this._logRequest(eventId, method, fullUrl, { ...options, headers: requestHeaders });

    console.log(curl);

    const response = await this.axiosInstance.request<T>(axiosConfig);

    const apiResponse = this._createApiResponse<T>(response, reqBody, curl);

    this._logResponse(eventId, apiResponse);

    return apiResponse;
  }

  private _createApiResponse<T>(response: AxiosResponse<T>, reqBody: unknown, curl: string): ApiResponse<T> {
    const headers: Record<string, string> = {};

    for (const [key, value] of Object.entries(response.headers)) {
      if (typeof value === 'string') headers[key] = value;
      if (Array.isArray(value)) headers[key] = value.join(', ');
    }

    return new ApiResponse<T>(
      response.status,
      response.statusText,
      headers,
      response.config.baseURL + (response.config.url || ''),
      response.data,
      reqBody,
      curl,
    );
  }

  private _buildFullUrl(path: string): string {
    if (path) {
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      return this.host + cleanPath;
    }

    return this.host;
  }

  private _logRequest(eventId: string, method: HttpMethod, fullUrl: string, options: Record<string, unknown>): void {
    const textLog = JSON.stringify(
      {
        event: 'Request',
        eventId,
        method,
        fullUrl,
        params: options.params,
        headers: options.headers,
        json: options.data || options.json,
        data: options.data || options.json,
      },
      null,
      4,
    );

    console.log(textLog);
  }

  private _logResponse(eventId: string, response: ApiResponse): void {
    const textLog = JSON.stringify(
      {
        event: 'Response',
        eventId,
        status_code: response.status,
        headers: response.headers,
        json: response.body,
      },
      null,
      4,
    );

    console.log(textLog);
  }

  private _toCurl(method: string, url: string, headers: Record<string, string> = {}, data?: unknown): string {
    let curl = `curl -X ${method} '${url}'`;

    for (const key in headers) {
      curl += ` -H '${key}: ${headers[key]}'`;
    }

    if (data) {
      curl += ` -d '${JSON.stringify(data)}'`;
    }

    return curl;
  }
}
