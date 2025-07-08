import { FlowAnimation } from '../src/core/animation';
import { getTargets } from '../src/utils';

describe('FlowAnimation', () => {
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement('div');
    element.style.opacity = '1';
    element.style.transform = 'translateX(0px)';
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  describe('constructor', () => {
    it('should create an animation with default options', () => {
      const targets = [element];
      const properties = { opacity: 0 };
      const animation = new FlowAnimation(targets, properties, { autoplay: false });

      expect(animation.targets).toEqual(targets);
      expect(animation.properties).toEqual(properties);
      expect(animation.options.duration).toBe(1000);
      expect(animation.options.easing).toBe('ease');
      expect(animation.finished).toBe(false);
      expect(animation.paused).toBe(false);
    });

    it('should merge custom options with defaults', () => {
      const targets = [element];
      const properties = { opacity: 0 };
      const options = { 
        duration: 2000, 
        easing: 'easeInOut',
        loop: true,
        autoplay: false 
      };
      const animation = new FlowAnimation(targets, properties, options);

      expect(animation.options.duration).toBe(2000);
      expect(animation.options.easing).toBe('easeInOut');
      expect(animation.options.loop).toBe(true);
    });
  });

  describe('play/pause/restart', () => {
    it('should play an animation', () => {
      const animation = new FlowAnimation([element], { opacity: 0 }, { autoplay: false });
      
      expect(animation.paused).toBe(false);
      animation.play();
      expect(animation.finished).toBe(false);
    });

    it('should pause an animation', () => {
      const animation = new FlowAnimation([element], { opacity: 0 }, { autoplay: false });
      
      animation.play();
      animation.pause();
      expect(animation.paused).toBe(true);
    });

    it('should restart an animation', () => {
      const animation = new FlowAnimation([element], { opacity: 0 }, { autoplay: false });
      
      animation.currentTime = 500;
      animation.progress = 0.5;
      animation.restart();
      
      expect(animation.currentTime).toBe(0);
      expect(animation.progress).toBe(0);
      expect(animation.finished).toBe(false);
    });
  });

  describe('seek', () => {
    it('should seek to a specific time', () => {
      const animation = new FlowAnimation([element], { opacity: 0 }, { 
        duration: 1000,
        autoplay: false 
      });
      
      animation.seek(500);
      expect(animation.currentTime).toBe(500);
      expect(animation.progress).toBe(0.5);
    });

    it('should clamp seek time to valid range', () => {
      const animation = new FlowAnimation([element], { opacity: 0 }, { 
        duration: 1000,
        autoplay: false 
      });
      
      animation.seek(-100);
      expect(animation.currentTime).toBe(0);
      
      animation.seek(1500);
      expect(animation.currentTime).toBe(1000);
    });
  });

  describe('callbacks', () => {
    it('should call onStart callback', (done) => {
      const onStart = jest.fn();
      const animation = new FlowAnimation([element], { opacity: 0 }, { 
        autoplay: false 
      }, { onStart });
      
      animation.play();
      
      setTimeout(() => {
        expect(onStart).toHaveBeenCalled();
        done();
      }, 20);
    });

    it('should call onUpdate callback', (done) => {
      const onUpdate = jest.fn();
      const animation = new FlowAnimation([element], { opacity: 0 }, { 
        duration: 100,
        autoplay: false 
      }, { onUpdate });
      
      animation.play();
      
      setTimeout(() => {
        expect(onUpdate).toHaveBeenCalled();
        done();
      }, 50);
    });

    it('should call onComplete callback', (done) => {
      const onComplete = jest.fn();
      const animation = new FlowAnimation([element], { opacity: 0 }, { 
        duration: 50,
        autoplay: false 
      }, { onComplete });
      
      animation.play();
      
      setTimeout(() => {
        expect(onComplete).toHaveBeenCalled();
        expect(animation.finished).toBe(true);
        done();
      }, 100);
    });
  });

  describe('property animation', () => {
    it('should animate opacity', (done) => {
      const animation = new FlowAnimation([element], { opacity: 0 }, { 
        duration: 100,
        autoplay: false 
      });
      
      animation.play();
      
      setTimeout(() => {
        const opacity = parseFloat(element.style.opacity);
        expect(opacity).toBeLessThan(1);
        expect(opacity).toBeGreaterThanOrEqual(0);
        done();
      }, 50);
    });

    it('should handle multiple properties', (done) => {
      const properties = { 
        opacity: 0.5,
        transform: 'translateX(100px)'
      };
      
      const animation = new FlowAnimation([element], properties, { 
        duration: 100,
        autoplay: false 
      });
      
      animation.play();
      
      setTimeout(() => {
        expect(element.style.opacity).not.toBe('1');
        expect(element.style.transform).toContain('translateX');
        done();
      }, 50);
    });
  });

  describe('direction and looping', () => {
    it('should handle reverse direction', () => {
      const animation = new FlowAnimation([element], { opacity: 0 }, { 
        duration: 1000,
        direction: 'reverse',
        autoplay: false 
      });
      
      // Simulate progress at 50%
      animation.seek(500);
      // With reverse direction, 50% progress should result in opacity closer to 1
      const opacity = parseFloat(element.style.opacity);
      expect(opacity).toBeGreaterThan(0.4);
    });
  });
});
