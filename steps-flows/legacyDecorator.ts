import { step as allureStep } from 'allure-js-commons';
import { getFullNameStepFlow } from '@steps-flows/getFullNameStepFlow.js';

export function legacyFlowDecorator(flowNameTemplate: string) {
  return function (target: any, _propertyKey: string, descriptor: PropertyDescriptor): void {
    const originalMethod = descriptor.value;

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    descriptor.value = async function (...args: any[]) {
      const stringArgs = args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg)));
      const className = target.constructor.name ?? 'UnknownClass';
      const fullName = `[${className}] ${flowNameTemplate}`;
      const fullNameStep = getFullNameStepFlow(fullName, stringArgs, 'Флоу');

      return allureStep(fullNameStep, async () => {
        return originalMethod.apply(this, args);
      });
    };
  };
}
