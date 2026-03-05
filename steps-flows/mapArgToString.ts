export function mapArgToString(arg: any): string {
  if (Array.isArray(arg)) {
    return `[${arg.map(mapArgToString).join(',')}]`;
  }

  return arg?.toString() ?? '';
}
