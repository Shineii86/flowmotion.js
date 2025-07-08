import {
  Animation,
  AnimationProperties,
  AnimationOptions,
  AnimationCallbacks,
  EasingFunction,
} from '../types';
import { getTargets, generateId, clamp, parseValue, setProperty, getCurrentValue, raf, caf } from '../utils';
import { getEasing } from './easing';

/**
 * Core Animation class
 */
export class FlowAnimation implements Animation {
  public id: string;
  public targets: Element[];
  public properties: AnimationProperties;
  public options: Required<AnimationOptions>;
  public callbacks: AnimationCallbacks;
  public startTime = 0;
  public currentTime = 0;
  public progress = 0;
  public finished = false;
  public paused = false;
  public reversed = false;
  public finishedPromise: Promise<void>;

  private rafId: number | null = null;
  private startValues: Map<Element, Map<string, { value: number; unit: string }>> = new Map();
  private endValues: Map<Element, Map<string, { value: number; unit: string }>> = new Map();
  private easingFunction: EasingFunction;
  private resolveFinished!: () => void;
  private iteration = 0;
  private maxIterations: number;

  constructor(
    targets: Element[],
    properties: AnimationProperties,
    options: AnimationOptions = {},
    callbacks: AnimationCallbacks = {}
  ) {
    this.id = generateId();
    this.targets = targets;
    this.properties = properties;
    this.callbacks = callbacks;

    // Set default options
    this.options = {
      duration: options.duration ?? 1000,
      delay: options.delay ?? 0,
      easing: options.easing ?? 'ease',
      loop: options.loop ?? false,
      direction: options.direction ?? 'normal',
      autoplay: options.autoplay ?? true,
      endDelay: options.endDelay ?? 0,
    };

    this.easingFunction = getEasing(this.options.easing);
    this.maxIterations = typeof this.options.loop === 'number' ? this.options.loop : Infinity;

    // Create finished promise
    this.finishedPromise = new Promise(resolve => {
      this.resolveFinished = resolve;
    });

    this.init();

    if (this.options.autoplay) {
      this.play();
    }
  }

  private init(): void {
    // Calculate start and end values for all properties
    this.targets.forEach(target => {
      const startMap = new Map<string, { value: number; unit: string }>();
      const endMap = new Map<string, { value: number; unit: string }>();

      Object.entries(this.properties).forEach(([property, value]) => {
        const currentValue = getCurrentValue(target, property);
        const startParsed = parseValue(currentValue);
        const endParsed = parseValue(value as string | number);

        startMap.set(property, startParsed);
        endMap.set(property, endParsed);
      });

      this.startValues.set(target, startMap);
      this.endValues.set(target, endMap);
    });
  }

  private animate = (timestamp: number): void => {
    if (this.paused || this.finished) {
      return;
    }

    if (!this.startTime) {
      this.startTime = timestamp - this.options.delay;
    }

    const elapsed = timestamp - this.startTime - this.options.delay;
    
    if (elapsed < 0) {
      this.rafId = raf(this.animate);
      return;
    }

    this.currentTime = elapsed;
    this.progress = clamp(elapsed / this.options.duration, 0, 1);

    let adjustedProgress = this.progress;

    // Apply direction
    if (this.options.direction === 'reverse' || 
        (this.options.direction === 'alternate' && this.iteration % 2 === 1) ||
        (this.options.direction === 'alternate-reverse' && this.iteration % 2 === 0)) {
      adjustedProgress = 1 - adjustedProgress;
    }

    // Apply easing
    const easedProgress = this.easingFunction(adjustedProgress);

    // Update properties
    this.updateProperties(easedProgress);

    // Call update callback
    if (this.callbacks.onUpdate) {
      this.callbacks.onUpdate(this.progress);
    }

    // Check if animation is complete
    if (this.progress >= 1) {
      this.handleComplete();
    } else {
      this.rafId = raf(this.animate);
    }
  };

  private updateProperties(progress: number): void {
    this.targets.forEach(target => {
      const startMap = this.startValues.get(target);
      const endMap = this.endValues.get(target);

      if (!startMap || !endMap) return;

      Object.keys(this.properties).forEach(property => {
        const start = startMap.get(property);
        const end = endMap.get(property);

        if (!start || !end) return;

        const currentValue = start.value + (end.value - start.value) * progress;
        const unit = end.unit || start.unit;
        const value = unit ? `${currentValue}${unit}` : currentValue.toString();

        setProperty(target, property, value);
      });
    });
  }

  private handleComplete(): void {
    // Call onLoop callback
    if (this.callbacks.onLoop) {
      this.callbacks.onLoop(this.iteration);
    }

    this.iteration++;

    // Check if we should loop
    if (this.options.loop && this.iteration < this.maxIterations) {
      this.startTime = 0;
      this.progress = 0;
      this.rafId = raf(this.animate);
      return;
    }

    // Animation is finished
    this.finished = true;
    
    if (this.callbacks.onComplete) {
      this.callbacks.onComplete();
    }

    this.resolveFinished();
  }

  public play(): Animation {
    if (this.finished) {
      this.restart();
      return this;
    }

    if (this.paused) {
      this.paused = false;
      this.rafId = raf(this.animate);
    } else if (!this.rafId) {
      if (this.callbacks.onStart) {
        this.callbacks.onStart();
      }
      this.rafId = raf(this.animate);
    }

    return this;
  }

  public pause(): Animation {
    this.paused = true;
    if (this.rafId) {
      caf(this.rafId);
      this.rafId = null;
    }
    return this;
  }

  public restart(): Animation {
    this.finished = false;
    this.paused = false;
    this.startTime = 0;
    this.currentTime = 0;
    this.progress = 0;
    this.iteration = 0;

    if (this.rafId) {
      caf(this.rafId);
    }

    // Create new finished promise
    this.finishedPromise = new Promise(resolve => {
      this.resolveFinished = resolve;
    });

    if (this.callbacks.onStart) {
      this.callbacks.onStart();
    }

    this.rafId = raf(this.animate);
    return this;
  }

  public reverse(): Animation {
    this.reversed = !this.reversed;
    
    // Swap start and end values
    this.targets.forEach(target => {
      const startMap = this.startValues.get(target);
      const endMap = this.endValues.get(target);

      if (startMap && endMap) {
        this.startValues.set(target, endMap);
        this.endValues.set(target, startMap);
      }
    });

    return this;
  }

  public seek(time: number): Animation {
    const clampedTime = clamp(time, 0, this.options.duration);
    this.currentTime = clampedTime;
    this.progress = clampedTime / this.options.duration;

    const easedProgress = this.easingFunction(this.progress);
    this.updateProperties(easedProgress);

    if (this.callbacks.onUpdate) {
      this.callbacks.onUpdate(this.progress);
    }

    return this;
  }
}
