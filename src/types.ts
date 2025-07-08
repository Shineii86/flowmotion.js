export type Target = Element | Element[] | NodeList | string;

export interface AnimationProperties {
  [key: string]: string | number | string[] | number[];
}

export interface AnimationOptions {
  duration?: number;
  delay?: number;
  easing?: string | EasingFunction;
  loop?: boolean | number;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  autoplay?: boolean;
  endDelay?: number;
}

export interface AnimationConfig extends AnimationOptions {
  targets: Target;
  properties: AnimationProperties;
}

export type EasingFunction = (t: number) => number;

export interface EasingFunctions {
  [key: string]: EasingFunction;
}

export interface Timeline {
  animations: Animation[];
  currentTime: number;
  duration: number;
  paused: boolean;
  finished: boolean;
}

export interface AnimationCallbacks {
  onStart?: () => void;
  onUpdate?: (progress: number) => void;
  onComplete?: () => void;
  onLoop?: (iteration: number) => void;
}

export interface PluginAPI {
  registerEasing: (name: string, fn: EasingFunction) => void;
  registerProperty: (name: string, handler: PropertyHandler) => void;
  version: string;
}

export interface PropertyHandler {
  parse: (value: string | number) => ParsedValue;
  interpolate: (from: ParsedValue, to: ParsedValue, progress: number) => string;
}

export interface ParsedValue {
  value: number;
  unit: string;
}

export interface AnimationFrame {
  time: number;
  properties: { [key: string]: string | number };
}

export interface Animation {
  id: string;
  targets: Element[];
  properties: AnimationProperties;
  options: Required<AnimationOptions>;
  callbacks: AnimationCallbacks;
  startTime: number;
  currentTime: number;
  progress: number;
  finished: boolean;
  paused: boolean;
  reversed: boolean;
  play(): Animation;
  pause(): Animation;
  restart(): Animation;
  reverse(): Animation;
  seek(time: number): Animation;
  finishedPromise: Promise<void>;
}
