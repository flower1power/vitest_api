export function Retries(attempts: number, delayMs = 1000) {
  return function (_target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor): void {
    const originalMethod = descriptor.value as (...args: unknown[]) => Promise<unknown>;

    if (!originalMethod) {
      throw new Error(`@Retries можно применять только к методам`);
    }

    descriptor.value = async function (this: unknown, ...args: unknown[]): Promise<unknown> {
      const methodName = String(propertyKey);

      for (let attempt = 1; attempt <= attempts; attempt++) {
        console.log(`[${methodName}] Попытка ${attempt} из ${attempts}`);

        const result = await originalMethod.apply(this, args);

        if (result !== undefined && result !== null) {
          return result;
        }

        if (attempt === attempts) {
          return result;
        }

        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }

      return undefined;
    };
  };
}
