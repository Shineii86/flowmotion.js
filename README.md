# FlowMotion.js 🌊

*(hobby.js XD)*

A modern, lightweight JavaScript animation library with TypeScript support, designed for smooth and performant animations.

[![NPM Version](https://img.shields.io/npm/v/@flowmotion/core.svg)](https://www.npmjs.com/package/@flowmotion/core)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@flowmotion/core.svg)](https://bundlephobia.com/result?p=@flowmotion/core)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/Shineii86/flowmotion.js/blob/main/LICENSE)

## ✨ Features

- 🚀 **Lightweight** - Less than 15KB gzipped
- 🎯 **TypeScript First** - Built with TypeScript, full type support
- 🎨 **Rich Easing Functions** - 30+ built-in easing functions
- 🔧 **Extensible** - Plugin system for custom functionality
- 📱 **Cross-Platform** - Works in all modern browsers and Node.js
- 🔄 **Timeline Support** - Orchestrate complex animation sequences
- ⚡ **High Performance** - Optimized for 60fps animations
- 🎛️ **Full Control** - Play, pause, seek, reverse animations

## 📦 Installation

```bash
# npm
npm install @flowmotion/core

# yarn
yarn add @flowmotion/core

# pnpm
pnpm add @flowmotion/core
```

## 🚀 Quick Start

### Basic Animation

```javascript
import flowMotion from '@flowmotion/core';

// Animate a single element
flowMotion({
  targets: '.my-element',
  properties: {
    opacity: 0,
    translateX: '100px',
    scale: 1.2
  },
  duration: 1000,
  easing: 'easeOutElastic'
});
```

### Using ES6 Imports

```typescript
import { flowMotion, timeline, easingFunctions } from '@flowmotion/core';

// Create an animation
const animation = flowMotion({
  targets: document.querySelector('.box'),
  properties: { 
    rotate: '360deg',
    backgroundColor: '#ff6b6b' 
  },
  duration: 2000,
  loop: true
});

// Control the animation
animation.pause();
animation.play();
animation.seek(1000); // Seek to 1 second
```

### CDN Usage

```html
<script src="https://unpkg.com/@flowmotion/core@latest/dist/flowmotion.umd.js"></script>
<script>
  FlowMotion({
    targets: '.my-element',
    properties: { opacity: 0 },
    duration: 1000
  });
</script>
```

## 📖 Documentation

### Core API

#### `flowMotion(config)`

Creates and starts an animation.

```typescript
interface AnimationConfig {
  targets: string | Element | Element[] | NodeList;
  properties: {
    [property: string]: string | number;
  };
  duration?: number;        // Default: 1000ms
  delay?: number;          // Default: 0ms
  easing?: string | Function; // Default: 'ease'
  loop?: boolean | number;  // Default: false
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  autoplay?: boolean;      // Default: true
  endDelay?: number;       // Default: 0ms
}
```

**Example:**
```javascript
const animation = flowMotion({
  targets: '.elements',
  properties: {
    opacity: [1, 0, 1],     // Keyframes
    translateY: '-50px',
    scale: 1.5,
    backgroundColor: '#ff6b6b'
  },
  duration: 2000,
  easing: 'easeInOutCubic',
  loop: 3,
  direction: 'alternate'
});
```

#### Animation Controls

```javascript
// Play/Pause/Control
animation.play();
animation.pause();
animation.restart();
animation.reverse();
animation.seek(1500); // Seek to specific time in ms

// Properties
animation.progress;    // Current progress (0-1)
animation.currentTime; // Current time in ms
animation.finished;    // Boolean: is animation finished?
animation.paused;      // Boolean: is animation paused?

// Promise-based completion
await animation.finishedPromise;
console.log('Animation completed!');
```

#### Callbacks

```javascript
flowMotion({
  targets: '.box',
  properties: { rotate: '360deg' },
  duration: 1000,
  onStart: () => console.log('Animation started'),
  onUpdate: (progress) => console.log(`Progress: ${progress * 100}%`),
  onComplete: () => console.log('Animation completed'),
  onLoop: (iteration) => console.log(`Loop ${iteration} completed`)
});
```

### Timeline

Create complex animation sequences:

```javascript
import { timeline } from '@flowmotion/core';

const tl = timeline();

tl.add({
  targets: '.box1',
  properties: { translateX: '100px' },
  duration: 1000
}).add({
  targets: '.box2',
  properties: { opacity: 0 },
  duration: 500
}, 500) // Start 500ms after previous animation
.add({
  targets: '.box3',
  properties: { scale: 2 },
  duration: 800
}, '-=200'); // Start 200ms before previous animation ends

// Control timeline
tl.play();
tl.pause();
tl.seek(1500);
tl.restart();
```

### Easing Functions

FlowMotion includes 30+ built-in easing functions:

```javascript
// Linear
'linear'

// Ease
'ease', 'easeIn', 'easeOut', 'easeInOut'

// Quad, Cubic, Quart, Quint
'easeInQuad', 'easeOutQuad', 'easeInOutQuad'
'easeInCubic', 'easeOutCubic', 'easeInOutCubic'
// ... and more

// Advanced
'easeInElastic', 'easeOutBounce', 'easeInOutBack'

// Custom easing function
flowMotion({
  targets: '.box',
  properties: { translateX: '100px' },
  easing: t => t * t * t, // Custom cubic function
  duration: 1000
});
```

### CSS Properties

FlowMotion supports all animatable CSS properties:

```javascript
// Transform properties
translateX, translateY, translateZ
rotate, rotateX, rotateY, rotateZ  
scale, scaleX, scaleY, scaleZ
skew, skewX, skewY

// Visual properties
opacity, backgroundColor, color
width, height, borderRadius
margin, padding, fontSize

// And many more...
```

### Plugins

Extend FlowMotion with custom functionality:

```javascript
import { use, pluginAPI } from '@flowmotion/core';

// Create a plugin
const myPlugin = {
  name: 'MyPlugin',
  version: '1.0.0',
  install: (api) => {
    // Add custom easing
    api.registerEasing('myEasing', t => t * t);
    
    // Add custom property handler
    api.registerProperty('customProp', {
      parse: (value) => ({ value: parseFloat(value), unit: 'px' }),
      interpolate: (from, to, progress) => {
        const value = from.value + (to.value - from.value) * progress;
        return `${value}${from.unit}`;
      }
    });
  }
};

// Use the plugin
use(myPlugin);
```

## 🎯 Examples

### Staggered Animations

```javascript
import { flowMotion } from '@flowmotion/core';

// Animate multiple elements with stagger
document.querySelectorAll('.item').forEach((el, i) => {
  flowMotion({
    targets: el,
    properties: {
      opacity: [0, 1],
      translateY: ['-20px', '0px']
    },
    duration: 600,
    delay: i * 100, // Stagger delay
    easing: 'easeOutCubic'
  });
});
```

### Loading Animation

```javascript
const loadingAnimation = flowMotion({
  targets: '.loader',
  properties: {
    rotate: '360deg'
  },
  duration: 1000,
  loop: true,
  easing: 'linear'
});

// Stop when loading is complete
fetch('/api/data')
  .then(() => loadingAnimation.pause());
```

### Morphing Shapes

```javascript
timeline()
  .add({
    targets: '.shape',
    properties: {
      borderRadius: ['0%', '50%'],
      backgroundColor: ['#3498db', '#e74c3c']
    },
    duration: 1000,
    easing: 'easeInOutCubic'
  })
  .add({
    targets: '.shape',
    properties: {
      scale: [1, 1.2, 1],
      rotate: '180deg'
    },
    duration: 800
  });
```

## 🔧 Development

```bash
# Clone the repository
git clone https://github.com/Shineii86/flowmotion.js.git
cd flowmotion

# Install dependencies
npm install

# Start development
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Check bundle size
npm run size
```

## 📊 Performance

FlowMotion is optimized for performance:

- **Lightweight**: < 15KB gzipped
- **Tree-shakable**: Only import what you need
- **60 FPS**: Optimized for smooth animations
- **Memory efficient**: Minimal memory footprint
- **Zero dependencies**: No external dependencies

## 🤝 Contributing

Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [Anime.js](https://animejs.com/) and [GSAP](https://greensock.com/)
- Built with modern JavaScript and TypeScript
- Uses Robert Penner's easing functions

## 📞 Support

- 📚 [Documentation](DOCUMENTATION.md)
- 🐛 [Issue Tracker](https://github.com/Shineii86/flowmotion.js/issues)
- 💬 [Discussions](https://github.com/Shineii86/flowmotion.js/discussions)
- 🌟 [Examples](https://flowmotion.dev/examples)

---

<div align="center">

Made with ❤️ by [Shinei Nouzen](https://github.com/Shineii86)
  
  *For inquiries or collaborations:*
     
[![Telegram Badge](https://img.shields.io/badge/-Telegram-2CA5E0?style=flat&logo=Telegram&logoColor=white)](https://telegram.me/Shineii86 "Contact on Telegram")
[![Instagram Badge](https://img.shields.io/badge/-Instagram-C13584?style=flat&logo=Instagram&logoColor=white)](https://instagram.com/ikx7.a "Follow on Instagram")
[![Pinterest Badge](https://img.shields.io/badge/-Pinterest-E60023?style=flat&logo=Pinterest&logoColor=white)](https://pinterest.com/ikx7a "Follow on Pinterest")
[![Gmail Badge](https://img.shields.io/badge/-Gmail-D14836?style=flat&logo=Gmail&logoColor=white)](mailto:ikx7a@hotmail.com "Send an Email")

  <sup><b>Copyright © 2025 <a href="https://telegram.me/Shineii86">Shinei Nouzen</a> All Rights Reserved</b></sup>

</div>
