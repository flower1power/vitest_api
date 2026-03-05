import { PLACEHOLDER_REGEX } from '@steps-flows/constants/index.js';
import { mapArgToString } from '@steps-flows/mapArgToString.js';

export function getFullNameStepFlow(flowNameTemplate: string, args: string[], prefix?: string): string {
  const countInsertArgumentsInStep = flowNameTemplate.match(PLACEHOLDER_REGEX);

  const prefixProcessed: string = prefix ? `${prefix} ` : '';
  const stepNameTemplateWithPrefix = `${prefixProcessed}${flowNameTemplate}`;

  if (countInsertArgumentsInStep) {
    return countInsertArgumentsInStep.reduce((acc, el) => {
      const numArgs = Number(el.replace(`{`, '').replace('}', ''));
      return acc.replace(el, mapArgToString(args[numArgs] || ''));
    }, stepNameTemplateWithPrefix);
  }

  return stepNameTemplateWithPrefix;
}
