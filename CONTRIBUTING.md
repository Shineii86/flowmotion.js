# Contributing to flowmotion.js 🤝

Thank you for your interest in contributing to FlowMotion! This guide will help you get started with contributing to our animation library.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Release Process](#release-process)

## 📜 Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [maintainers@flowmotion.dev](mailto:maintainers@flowmotion.dev).

## 🚀 Getting Started

### Prerequisites

- Node.js 14.0 or higher
- npm 6.0 or higher
- Git

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/your-username/flowmotion.git
cd flowmotion
```

3. Add the original repository as upstream:

```bash
git remote add upstream https://github.com/Shineii86/flowmotion.js.git
```

## 🛠 Development Setup

1. Install dependencies:

```bash
npm install
```

2. Start development mode:

```bash
npm run dev
```

3. Run tests:

```bash
npm test
```

4. Check code quality:

```bash
npm run lint
npm run type-check
```

## 📁 Project Structure

```
flowmotion/
├── src/                    # Source code
│   ├── core/              # Core animation engine
│   │   ├── animation.ts   # Main animation class
│   │   ├── timeline.ts    # Timeline functionality
│   │   └── easing.ts      # Easing functions
│   ├── utils/             # Utility functions
│   │   └── index.ts       # DOM helpers, math utils
│   ├── plugins/           # Plugin system
│   │   └── index.ts       # Plugin API and built-ins
│   ├── types.ts           # TypeScript type definitions
│   └── index.ts           # Main entry point
├── tests/                 # Test files
│   ├── setup.ts           # Test configuration
│   ├── animation.test.ts  # Animation tests
│   └── utils.test.ts      # Utility tests
├── examples/              # Usage examples
├── docs/                  # Documentation
├── scripts/               # Build scripts
├── dist/                  # Built files (generated)
└── coverage/              # Test coverage (generated)
```

## 🔄 Development Workflow

### Branch Naming

- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/urgent-fix` - Critical fixes
- `docs/documentation-update` - Documentation changes
- `refactor/code-improvement` - Code refactoring

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(core): add support for custom easing functions
fix(timeline): resolve memory leak in animation cleanup
docs(readme): update installation instructions
test(utils): add tests for parseValue function
```

### Making Changes

1. Create a new branch:

```bash
git checkout -b feature/your-feature-name
```

2. Make your changes following our [coding standards](#coding-standards)

3. Add tests for new functionality

4. Run the test suite:

```bash
npm test
npm run lint
npm run type-check
```

5. Commit your changes:

```bash
git add .
git commit -m "feat(core): add your feature description"
```

6. Push to your fork:

```bash
git push origin feature/your-feature-name
```

## 📝 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Prefer explicit types over `any`
- Use interfaces for object shapes
- Export types with `export type`

```typescript
// Good
interface AnimationOptions {
  duration: number;
  easing: string | EasingFunction;
}

// Avoid
const options: any = { duration: 1000 };
```

### Code Style

We use ESLint and Prettier for code formatting:

```bash
# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

**Key rules:**
- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in objects/arrays
- Max line length: 80 characters
- Use camelCase for variables and functions
- Use PascalCase for classes and interfaces

### Documentation

- Add JSDoc comments for public APIs
- Include examples in complex functions
- Update README for new features
- Add inline comments for complex logic

```typescript
/**
 * Creates a new animation with the specified configuration
 * @param config - Animation configuration object
 * @returns Animation instance
 * @example
 * ```typescript
 * const animation = createAnimation({
 *   targets: '.element',
 *   properties: { opacity: 0 },
 *   duration: 1000
 * });
 * ```
 */
export function createAnimation(config: AnimationConfig): Animation {
  // Implementation
}
```

## 🧪 Testing

### Writing Tests

- Write tests for all new functionality
- Use descriptive test names
- Group related tests with `describe` blocks
- Use `beforeEach`/`afterEach` for setup/cleanup

```typescript
describe('FlowAnimation', () => {
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('should animate opacity from 1 to 0', () => {
    const animation = new FlowAnimation(
      [element], 
      { opacity: 0 }, 
      { duration: 1000 }
    );
    
    expect(animation.targets).toContain(element);
    expect(animation.properties.opacity).toBe(0);
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run specific test file
npm test -- animation.test.ts
```

### Test Coverage

We aim for 90%+ test coverage. Check coverage with:

```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

## 📤 Submitting Changes

### Pull Request Process

1. Ensure your branch is up to date:

```bash
git fetch upstream
git checkout main
git merge upstream/main
git checkout your-feature-branch
git rebase main
```

2. Create a pull request from your fork to the main repository

3. Fill out the pull request template with:
   - Clear description of changes
   - Link to related issues
   - Screenshots/demos if applicable
   - Breaking changes (if any)

### Pull Request Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added tests for new functionality
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. Automated checks must pass (CI/CD)
2. Code review by maintainers
3. Address feedback if requested
4. Approval and merge by maintainers

## 🚀 Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality
- **PATCH** version for backwards-compatible bug fixes

### Release Workflow

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create release commit
4. Tag the release
5. Push to trigger automated deployment

```bash
# Example release process
npm version minor
git push origin main --tags
```

## 🏷️ Issue Labels

We use labels to categorize issues:

- `bug` - Bug reports
- `feature` - Feature requests
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `priority: high` - High priority issues
- `status: needs review` - Awaiting review

## ❓ Getting Help

- 📚 Check the [documentation](DOCUMENTATION.md)
- 🔍 Search existing [issues](https://github.com/Shineii86/flowmotion.js/issues)
- 💬 Join our [discussions](https://github.com/Shineii86/flowmotion.js/discussions)

## 🙏 Recognition

Contributors will be:
- Added to the contributors list
- Mentioned in release notes
- Invited to the maintainers team (for significant contributions)

Thank you for contributing to flowmotion.js! 🌊
