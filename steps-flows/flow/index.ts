import { legacyFlowDecorator } from '@steps-flows/legacyDecorator.js';
import { ModernFlowDecorator } from '@steps-flows/modernDecorator.js';

export function Flow(flowNameTemplate: string) {
  return function (
    target: any,
    propertyKeyOrContext?: string | ClassMethodDecoratorContext,
    descriptor?: PropertyDescriptor,
  ): any {
    const isLegacySyntax = arguments.length === 3 && typeof propertyKeyOrContext === 'string';

    if (isLegacySyntax) {
      return legacyFlowDecorator(flowNameTemplate)(target, propertyKeyOrContext, descriptor!);
    } else {
      return ModernFlowDecorator(flowNameTemplate)(target, propertyKeyOrContext as ClassMethodDecoratorContext);
    }
  };
}
