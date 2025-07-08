import { EasingFunction, EasingFunctions } from '../types';

/**
 * Built-in easing functions
 */
export const easingFunctions: EasingFunctions = {
  // Linear
  linear: (t: number): number => t,
  
  // Ease
  ease: (t: number): number => cubicBezier(0.25, 0.1, 0.25, 1)(t),
  easeIn: (t: number): number => cubicBezier(0.42, 0, 1, 1)(t),
  easeOut: (t: number): number => cubicBezier(0, 0, 0.58, 1)(t),
  easeInOut: (t: number): number => cubicBezier(0.42, 0, 0.58, 1)(t),
  
  // Quad
  easeInQuad: (t: number): number => t * t,
  easeOutQuad: (t: number): number => t * (2 - t),
  easeInOutQuad: (t: number): number => 
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  
  // Cubic
  easeInCubic: (t: number): number => t * t * t,
  easeOutCubic: (t: number): number => --t * t * t + 1,
  easeInOutCubic: (t: number): number =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  
  // Quart
  easeInQuart: (t: number): number => t * t * t * t,
  easeOutQuart: (t: number): number => 1 - --t * t * t * t,
  easeInOutQuart: (t: number): number =>
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
  
  // Quint
  easeInQuint: (t: number): number => t * t * t * t * t,
  easeOutQuint: (t: number): number => 1 + --t * t * t * t * t,
  easeInOutQuint: (t: number): number =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,
  
  // Sine
  easeInSine: (t: number): number => 1 - Math.cos((t * Math.PI) / 2),
  easeOutSine: (t: number): number => Math.sin((t * Math.PI) / 2),
  easeInOutSine: (t: number): number => -(Math.cos(Math.PI * t) - 1) / 2,
  
  // Expo
  easeInExpo: (t: number): number => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),
  easeOutExpo: (t: number): number => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutExpo: (t: number): number => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if ((t /= 0.5) < 1) return 0.5 * Math.pow(2, 10 * (t - 1));
    return 0.5 * (-Math.pow(2, -10 * --t) + 2);
  },
  
  // Circ
  easeInCirc: (t: number): number => -(Math.sqrt(1 - t * t) - 1),
  easeOutCirc: (t: number): number => Math.sqrt(1 - (t = t - 1) * t),
  easeInOutCirc: (t: number): number => {
    if ((t /= 0.5) < 1) return -0.5 * (Math.sqrt(1 - t * t) - 1);
    return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
  },
  
  // Back
  easeInBack: (t: number): number => {
    const s = 1.70158;
    return t * t * ((s + 1) * t - s);
  },
  easeOutBack: (t: number): number => {
    const s = 1.70158;
    return --t * t * ((s + 1) * t + s) + 1;
  },
  easeInOutBack: (t: number): number => {
    const s = 1.70158 * 1.525;
    if ((t /= 0.5) < 1) return 0.5 * (t * t * ((s + 1) * t - s));
    return 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2);
  },
  
  // Elastic
  easeInElastic: (t: number): number => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    const p = 0.3;
    const s = p / 4;
    return -(Math.pow(2, 10 * (t -= 1)) * Math.sin(((t - s) * (2 * Math.PI)) / p));
  },
  easeOutElastic: (t: number): number => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    const p = 0.3;
    const s = p / 4;
    return Math.pow(2, -10 * t) * Math.sin(((t - s) * (2 * Math.PI)) / p) + 1;
  },
  easeInOutElastic: (t: number): number => {
    if (t === 0) return 0;
    if ((t /= 0.5) === 2) return 1;
    const p = 0.3 * 1.5;
    const s = p / 4;
    if (t < 1) {
      return -0.5 * (Math.pow(2, 10 * (t -= 1)) * Math.sin(((t - s) * (2 * Math.PI)) / p));
    }
    return Math.pow(2, -10 * (t -= 1)) * Math.sin(((t - s) * (2 * Math.PI)) / p) * 0.5 + 1;
  },
  
  // Bounce
  easeInBounce: (t: number): number => 1 - easingFunctions.easeOutBounce(1 - t),
  easeOutBounce: (t: number): number => {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
  },
  easeInOutBounce: (t: number): number => {
    if (t < 0.5) return easingFunctions.easeInBounce(t * 2) * 0.5;
    return easingFunctions.easeOutBounce(t * 2 - 1) * 0.5 + 0.5;
  },
};

/**
 * Create a cubic bezier easing function
 */
export function cubicBezier(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): EasingFunction {
  return (t: number): number => {
    // Simple approximation for cubic bezier
    // For production, you might want to use a more accurate implementation
    const cx = 3.0 * x1;
    const bx = 3.0 * (x2 - x1) - cx;
    const ax = 1.0 - cx - bx;
    
    const cy = 3.0 * y1;
    // const by = 3.0 * (y2 - y1) - cy; // Not used in calculation
    // const ay = 1.0 - cy - by; // Not used in calculation
    
    return ((ax * t + bx) * t + cx) * t;
  };
}

/**
 * Get an easing function by name or return the function if already a function
 */
export function getEasing(easing: string | EasingFunction): EasingFunction {
  if (typeof easing === 'function') {
    return easing;
  }
  
  return easingFunctions[easing] || easingFunctions.ease;
}

/**
 * Register a custom easing function
 */
export function registerEasing(name: string, fn: EasingFunction): void {
  easingFunctions[name] = fn;
}
