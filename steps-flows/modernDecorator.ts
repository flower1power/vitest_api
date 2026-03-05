import { step as allureStep } from 'allure-js-commons';
import { getFullNameStepFlow } from '@steps-flows/getFullNameStepFlow.js';

export function ModernFlowDecorator(flowNameTemplate: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  return function (target: Function, _context: ClassMethodDecoratorContext): Function {
    return async function (this: any, ...args: any[]): Promise<any> {
      const stringArgs = args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg)));
      const className = this?.constructor?.name ?? 'UnknownClass';
      const fullName = `[${className}] ${flowNameTemplate}`;
      const fullNameStep = getFullNameStepFlow(fullName, stringArgs, 'Флоу');

      return allureStep(fullNameStep, async () => {
        return (target as any).apply(this, args);
      });
    };
  };
}
