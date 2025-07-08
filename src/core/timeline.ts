import { Timeline, Animation, AnimationConfig } from '../types';
import { FlowAnimation } from './animation';
import { getTargets } from '../utils';

/**
 * Timeline class for managing multiple animations
 */
export class FlowTimeline implements Timeline {
  public animations: Animation[] = [];
  public currentTime = 0;
  public duration = 0;
  public paused = false;
  public finished = false;

  private startTime = 0;
  private rafId: number | null = null;
  private animationStartTimes = new Map<string, number>();

  constructor() {
    this.update();
  }

  /**
   * Add an animation to the timeline
   */
  public add(config: AnimationConfig, offset = 0): FlowTimeline {
    const targets = getTargets(config.targets);
    const animation = new FlowAnimation(
      targets,
      config.properties,
      { ...config, autoplay: false }
    );

    // Set the animation start time based on offset
    const insertTime = this.currentTime + offset;
    
    this.animations.push(animation);
    this.animationStartTimes.set(animation.id, insertTime);

    // Update timeline duration
    const animationEnd = insertTime + (animation.options.duration || 1000);
    this.duration = Math.max(this.duration, animationEnd);

    return this;
  }

  /**
   * Play the timeline
   */
  public play(): FlowTimeline {
    if (this.finished) {
      this.restart();
      return this;
    }

    this.paused = false;
    this.startTime = performance.now() - this.currentTime;
    
    if (!this.rafId) {
      this.rafId = requestAnimationFrame(this.tick);
    }

    return this;
  }

  /**
   * Pause the timeline
   */
  public pause(): FlowTimeline {
    this.paused = true;
    
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    this.animations.forEach(animation => {
      if (!animation.finished && !animation.paused) {
        animation.pause();
      }
    });

    return this;
  }

  /**
   * Restart the timeline
   */
  public restart(): FlowTimeline {
    this.currentTime = 0;
    this.finished = false;
    this.paused = false;
    
    this.animations.forEach(animation => {
      animation.restart();
    });

    this.play();
    return this;
  }

  /**
   * Seek to a specific time in the timeline
   */
  public seek(time: number): FlowTimeline {
    this.currentTime = Math.max(0, Math.min(time, this.duration));
    
    this.animations.forEach(animation => {
      const animationStartTime = this.animationStartTimes.get(animation.id) || 0;
      const relativeTime = this.currentTime - animationStartTime;
      
      if (relativeTime >= 0 && relativeTime <= animation.options.duration) {
        animation.seek(relativeTime);
      }
    });

    return this;
  }

  /**
   * Get the progress of the timeline (0 to 1)
   */
  public getProgress(): number {
    return this.duration > 0 ? this.currentTime / this.duration : 0;
  }

  private tick = (timestamp: number): void => {
    if (this.paused) return;

    if (!this.startTime) {
      this.startTime = timestamp;
    }

    this.currentTime = timestamp - this.startTime;

    // Update animations
    this.animations.forEach(animation => {
      const animationStartTime = this.animationStartTimes.get(animation.id) || 0;
      const relativeTime = this.currentTime - animationStartTime;
      
      if (relativeTime >= 0 && !animation.finished) {
        if (animation.paused) {
          animation.play();
        }
      }
    });

    // Check if timeline is finished
    if (this.currentTime >= this.duration) {
      this.finished = true;
      this.currentTime = this.duration;
      
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    } else {
      this.rafId = requestAnimationFrame(this.tick);
    }
  };

  private update(): void {
    // Sort animations by start time
    this.animations.sort((a, b) => {
      const aStartTime = this.animationStartTimes.get(a.id) || 0;
      const bStartTime = this.animationStartTimes.get(b.id) || 0;
      return aStartTime - bStartTime;
    });
  }
}
