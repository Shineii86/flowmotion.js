import { FlowAnimation } from './core/animation';
import { FlowTimeline } from './core/timeline';
import { easingFunctions, registerEasing, getEasing } from './core/easing';
import { pluginAPI, use } from './plugins';
import { getTargets } from './utils';
import {
  Target,
  AnimationProperties,
  AnimationOptions,
  AnimationCallbacks,
  AnimationConfig,
  EasingFunction,
} from './types';

/**
 * Main FlowMotion function - creates and starts an animation
 */
export function flowMotion(config: AnimationConfig): FlowAnimation {
  const targets = getTargets(config.targets);
  const { targets: _, properties, ...options } = config;
  return new FlowAnimation(targets, properties, options);
}

/**
 * Create a new timeline
 */
export function timeline(): FlowTimeline {
  return new FlowTimeline();
}

/**
 * Set global default options
 */
const defaultOptions: Partial<AnimationOptions> = {
  duration: 1000,
  easing: 'ease',
  delay: 0,
  loop: false,
  direction: 'normal',
  autoplay: true,
  endDelay: 0,
};

export function setDefaults(options: Partial<AnimationOptions>): void {
  Object.assign(defaultOptions, options);
}

export function getDefaults(): Partial<AnimationOptions> {
  return { ...defaultOptions };
}

/**
 * Utility functions
 */
export const utils = {
  getTargets,
  parseValue: (value: string | number) => {
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
  },
  clamp: (value: number, min: number, max: number) => Math.min(Math.max(value, min), max),
  lerp: (start: number, end: number, progress: number) => start + (end - start) * progress,
};

/**
 * Export everything
 */
export {
  // Core classes
  FlowAnimation as Animation,
  FlowTimeline as Timeline,
  
  // Easing
  easingFunctions,
  registerEasing,
  getEasing,
  
  // Plugins
  pluginAPI,
  use,
  
};

// Type exports
export type {
  Target,
  AnimationProperties,
  AnimationOptions,
  AnimationCallbacks,
  AnimationConfig,
  EasingFunction,
};

/**
 * Default export
 */
export default flowMotion;

// Version
export const version = '1.0.0';

// Browser global
if (typeof window !== 'undefined') {
  (window as any).FlowMotion = flowMotion;
  (window as any).FlowMotion.timeline = timeline;
  (window as any).FlowMotion.utils = utils;
  (window as any).FlowMotion.easingFunctions = easingFunctions;
  (window as any).FlowMotion.version = version;
}
