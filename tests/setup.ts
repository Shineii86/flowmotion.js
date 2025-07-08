/**
 * Test setup file
 */

// Mock requestAnimationFrame for testing
(globalThis as any).requestAnimationFrame = (callback: FrameRequestCallback): number => {
  return setTimeout(callback, 16) as unknown as number;
};

(globalThis as any).cancelAnimationFrame = (id: number): void => {
  clearTimeout(id);
};

// Mock performance.now
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn(() => Date.now())
  }
});

// Create a basic DOM environment
document.body.innerHTML = '<div id="test-element"></div>';

// Add custom matchers if needed
expect.extend({
  toBeCloseToTime(received: number, expected: number, precision = 50) {
    const pass = Math.abs(received - expected) < precision;
    return {
      message: () =>
        `expected ${received} to be close to ${expected} within ${precision}ms`,
      pass,
    };
  },
});