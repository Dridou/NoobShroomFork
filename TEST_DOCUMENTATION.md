# Test Documentation

## Overview
This repository now includes a testing infrastructure using Jest and React Testing Library for Next.js components.

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (reruns on file changes)
npm run test:watch
```

## Test Structure

Tests are located in `__tests__` directories alongside the components they test:
- `src/components/featured/__tests__/Featured.test.jsx`

## Example: Featured Component Tests

The Featured component test demonstrates several testing patterns:

### 1. **Static Content Testing**
Tests verify that static text and elements render correctly:
```javascript
expect(screen.getByText(/Your ultimate Legend of Mushrooms reference/i)).toBeInTheDocument();
```

### 2. **Async Data Fetching**
Tests mock the `fetch` API and verify the component handles async data:
```javascript
global.fetch.mockResolvedValueOnce({
  ok: true,
  json: async () => ({ title: 'Test Post Title' }),
});

await waitFor(() => {
  expect(screen.getByText(mockPostTitle)).toBeInTheDocument();
});
```

### 3. **Error Handling**
Tests verify the component handles errors gracefully:
```javascript
global.fetch.mockResolvedValueOnce({
  ok: false,
});
// Component should still render even if fetch fails
```

### 4. **Image Rendering**
Tests verify images are rendered with correct attributes:
```javascript
const image = container.querySelector('img[src="/images/prophet-character.png"]');
expect(image).toBeInTheDocument();
```

### 5. **Links and Navigation**
Tests verify links have correct href attributes:
```javascript
const readMoreLink = screen.getByRole('link', { name: /Read more/i });
expect(readMoreLink).toHaveAttribute('href', 'http://localhost:3000/posts/prophet-preblitz-class-guide');
```

## Test Configuration

### jest.config.js
- Uses `next/jest` for Next.js compatibility
- Configured with jsdom environment for browser-like testing
- Module path mapping for `@/` imports

### jest.setup.js
- Imports `@testing-library/jest-dom` for additional matchers

## Current Test Coverage

- ✅ Featured Component: 5 tests
  - Static content rendering
  - Async data fetching
  - Error handling
  - Image rendering
  - Link verification

## Adding New Tests

1. Create a `__tests__` directory next to your component
2. Create a test file: `ComponentName.test.jsx`
3. Import necessary testing utilities:
   ```javascript
   import { render, screen, waitFor } from '@testing-library/react';
   ```
4. Write your tests following the patterns shown in `Featured.test.jsx`
5. Run `npm test` to verify

## Best Practices

1. **Mock external dependencies** (fetch, Next.js components, etc.)
2. **Use `waitFor`** for async operations
3. **Test user-visible behavior**, not implementation details
4. **Use accessible queries** (`getByRole`, `getByLabelText`, etc.)
5. **Clean up mocks** in `beforeEach` hooks

## Future Improvements

Potential areas for expansion:
- Add tests for other components (CardList, Menu, Comments, etc.)
- Add integration tests for API routes
- Add E2E tests with Playwright or Cypress
- Increase test coverage metrics
