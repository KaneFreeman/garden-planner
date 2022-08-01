import { isNotNullish } from './null.util';

export function isNotEmpty(value: string | null | undefined): value is string {
  return isNotNullish(value) && value !== '';
}

export function toTitleCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
}

export function toTitleCaseFromKey(str: string) {
  return str.replace(/_/g, ' ').replace(/\w\S*/g, toTitleCase);
}

export function toTitleCaseFromVariableName(str: string) {
  return str
    .split(/(?=[A-Z])/)
    .join(' ')
    .replace(/\w\S*/g, toTitleCase);
}
