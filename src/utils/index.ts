import { Target, ParsedValue } from '../types';

/**
 * Convert various target types to an array of Elements
 */
export function getTargets(targets: Target): Element[] {
  if (typeof targets === 'string') {
    return Array.from(document.querySelectorAll(targets));
  }
  
  if (targets instanceof Element) {
    return [targets];
  }
  
  if (targets instanceof NodeList) {
    return Array.from(targets).filter(node => node instanceof Element) as Element[];
  }
  
  if (Array.isArray(targets)) {
    return targets.filter(target => target instanceof Element);
  }
  
  return [];
}

/**
 * Parse CSS values with units
 */
export function parseValue(value: string | number): ParsedValue {
  if (typeof value === 'number') {
    return { value, unit: '' };
  }
  
  const match = value.toString().match(/^([+-]?\d*\.?\d+)(.*)$/);
  if (!match) {
    return { value: 0, unit: '' };
  }
  
  return {
    value: parseFloat(match[1]),
    unit: match[2] || ''
  };
}

/**
 * Generate a unique ID for animations
 */
export function generateId(): string {
  return `fm_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
}

/**
 * Clamp a number between min and max values
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between two numbers
 */
export function lerp(start: number, end: number, progress: number): number {
  return start + (end - start) * progress;
}

/**
 * Check if a value is a valid CSS property
 */
export function isValidCSSProperty(property: string): boolean {
  const element = document.createElement('div');
  return property in element.style;
}

/**
 * Convert camelCase to kebab-case
 */
export function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Get the current computed style value for a property
 */
export function getCurrentValue(element: Element, property: string): string {
  const computedStyle = window.getComputedStyle(element);
  const kebabProperty = camelToKebab(property);
  return computedStyle.getPropertyValue(kebabProperty) || '0';
}

/**
 * Set a CSS property on an element
 */
export function setProperty(
  element: Element,
  property: string,
  value: string | number
): void {
  const htmlElement = element as HTMLElement;
  const kebabProperty = camelToKebab(property);
  
  if (htmlElement.style) {
    htmlElement.style.setProperty(kebabProperty, value.toString());
  }
}

/**
 * Check if the current environment supports requestAnimationFrame
 */
export function supportsRequestAnimationFrame(): boolean {
  return typeof requestAnimationFrame !== 'undefined';
}

/**
 * Fallback for requestAnimationFrame
 */
export function raf(callback: FrameRequestCallback): number {
  if (supportsRequestAnimationFrame()) {
    return requestAnimationFrame(callback);
  }
  return setTimeout(callback, 16) as unknown as number;
}

/**
 * Fallback for cancelAnimationFrame
 */
export function caf(id: number): void {
  if (supportsRequestAnimationFrame()) {
    cancelAnimationFrame(id);
  } else {
    clearTimeout(id);
  }
}
