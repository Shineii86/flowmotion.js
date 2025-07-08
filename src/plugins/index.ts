import { PluginAPI, PropertyHandler, EasingFunction } from '../types';
import { registerEasing } from '../core/easing';

const propertyHandlers = new Map<string, PropertyHandler>();

/**
 * Plugin API for extending FlowMotion
 */
export const pluginAPI: PluginAPI = {
  registerEasing: (name: string, fn: EasingFunction): void => {
    registerEasing(name, fn);
  },
  
  registerProperty: (name: string, handler: PropertyHandler): void => {
    propertyHandlers.set(name, handler);
  },
  
  version: '1.0.0',
};

/**
 * Get a property handler by name
 */
export function getPropertyHandler(name: string): PropertyHandler | undefined {
  return propertyHandlers.get(name);
}

/**
 * Default property handlers
 */
const defaultPropertyHandlers: { [key: string]: PropertyHandler } = {
  opacity: {
    parse: (value: string | number) => ({
      value: typeof value === 'number' ? value : parseFloat(value.toString()),
      unit: '',
    }),
    interpolate: (from, to, progress) => {
      const value = from.value + (to.value - from.value) * progress;
      return value.toString();
    },
  },
  
  scale: {
    parse: (value: string | number) => ({
      value: typeof value === 'number' ? value : parseFloat(value.toString()),
      unit: '',
    }),
    interpolate: (from, to, progress) => {
      const value = from.value + (to.value - from.value) * progress;
      return value.toString();
    },
  },
  
  color: {
    parse: (value: string | number) => {
      // Simple color parsing - in production, you'd want more robust color handling
      const stringValue = value.toString();
      if (stringValue.startsWith('#')) {
        const hex = stringValue.slice(1);
        const num = parseInt(hex, 16);
        return {
          value: num,
          unit: 'hex',
        };
      }
      return { value: 0, unit: '' };
    },
    interpolate: (from, to, progress) => {
      if (from.unit === 'hex' && to.unit === 'hex') {
        // Simple hex interpolation
        const fromR = (from.value >> 16) & 255;
        const fromG = (from.value >> 8) & 255;
        const fromB = from.value & 255;
        
        const toR = (to.value >> 16) & 255;
        const toG = (to.value >> 8) & 255;
        const toB = to.value & 255;
        
        const r = Math.round(fromR + (toR - fromR) * progress);
        const g = Math.round(fromG + (toG - fromG) * progress);
        const b = Math.round(fromB + (toB - fromB) * progress);
        
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
      }
      return from.value.toString();
    },
  },
};

// Register default property handlers
Object.entries(defaultPropertyHandlers).forEach(([name, handler]) => {
  pluginAPI.registerProperty(name, handler);
});

/**
 * Plugin interface for third-party plugins
 */
export interface Plugin {
  name: string;
  version: string;
  install: (api: PluginAPI) => void;
}

/**
 * Install a plugin
 */
export function use(plugin: Plugin): void {
  plugin.install(pluginAPI);
}
