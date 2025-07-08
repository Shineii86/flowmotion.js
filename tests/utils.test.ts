import { 
  getTargets, 
  parseValue, 
  clamp, 
  lerp, 
  camelToKebab,
  generateId 
} from '../src/utils';

describe('Utils', () => {
  describe('getTargets', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div class="test-element" id="element1"></div>
        <div class="test-element" id="element2"></div>
        <div id="single-element"></div>
      `;
    });

    it('should convert string selector to elements array', () => {
      const targets = getTargets('.test-element');
      expect(targets).toHaveLength(2);
      expect(targets[0]).toBeInstanceOf(Element);
    });

    it('should convert single element to array', () => {
      const element = document.getElementById('single-element')!;
      const targets = getTargets(element);
      expect(targets).toHaveLength(1);
      expect(targets[0]).toBe(element);
    });

    it('should handle NodeList', () => {
      const nodeList = document.querySelectorAll('.test-element');
      const targets = getTargets(nodeList);
      expect(targets).toHaveLength(2);
      expect(targets[0]).toBeInstanceOf(Element);
    });

    it('should handle array of elements', () => {
      const element1 = document.getElementById('element1')!;
      const element2 = document.getElementById('element2')!;
      const targets = getTargets([element1, element2]);
      expect(targets).toHaveLength(2);
      expect(targets).toContain(element1);
      expect(targets).toContain(element2);
    });

    it('should return empty array for invalid targets', () => {
      const targets = getTargets('.non-existent');
      expect(targets).toHaveLength(0);
    });
  });

  describe('parseValue', () => {
    it('should parse number values', () => {
      const result = parseValue(42);
      expect(result).toEqual({ value: 42, unit: '' });
    });

    it('should parse string values with units', () => {
      const result = parseValue('100px');
      expect(result).toEqual({ value: 100, unit: 'px' });
    });

    it('should parse negative values', () => {
      const result = parseValue('-50em');
      expect(result).toEqual({ value: -50, unit: 'em' });
    });

    it('should parse decimal values', () => {
      const result = parseValue('0.5');
      expect(result).toEqual({ value: 0.5, unit: '' });
    });

    it('should handle invalid values', () => {
      const result = parseValue('invalid');
      expect(result).toEqual({ value: 0, unit: '' });
    });
  });

  describe('clamp', () => {
    it('should clamp value within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });

  describe('lerp', () => {
    it('should interpolate between values', () => {
      expect(lerp(0, 100, 0)).toBe(0);
      expect(lerp(0, 100, 1)).toBe(100);
      expect(lerp(0, 100, 0.5)).toBe(50);
      expect(lerp(10, 20, 0.25)).toBe(12.5);
    });
  });

  describe('camelToKebab', () => {
    it('should convert camelCase to kebab-case', () => {
      expect(camelToKebab('backgroundColor')).toBe('background-color');
      expect(camelToKebab('fontSize')).toBe('font-size');
      expect(camelToKebab('marginTop')).toBe('margin-top');
      expect(camelToKebab('opacity')).toBe('opacity');
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).toMatch(/^fm_/);
      expect(id2).toMatch(/^fm_/);
      expect(id1).not.toBe(id2);
    });
  });
});