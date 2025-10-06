import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Featured from '../Featured';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock fetch globally
global.fetch = jest.fn();

describe('Featured Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('renders the main title and subtitle', () => {
    // Mock the fetch response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ title: 'Test Post Title' }),
    });

    render(<Featured />);
    
    // Check if the main title is rendered
    expect(screen.getByText(/Your ultimate Legend of Mushrooms reference/i)).toBeInTheDocument();
    
    // Check if the subtitle is rendered
    expect(screen.getByText(/Most/i)).toBeInTheDocument();
    expect(screen.getByText(/in-depth guides/i)).toBeInTheDocument();
    expect(screen.getByText(/experienced players/i)).toBeInTheDocument();
  });

  it('renders the static content correctly', () => {
    // Mock the fetch response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ title: 'Test Post Title' }),
    });

    render(<Featured />);
    
    // Check if the static description is rendered
    expect(screen.getByText(/Discover all the knowledge acumulated/i)).toBeInTheDocument();
    
    // Check if the "Read more" link exists
    const readMoreLink = screen.getByRole('link', { name: /Read more/i });
    expect(readMoreLink).toBeInTheDocument();
    expect(readMoreLink).toHaveAttribute('href', 'http://localhost:3000/posts/prophet-preblitz-class-guide');
  });

  it('fetches and displays the post title', async () => {
    const mockPostTitle = 'Prophet Pre-Blitz Guide';
    
    // Mock the fetch response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ title: mockPostTitle }),
    });

    render(<Featured />);
    
    // Wait for the post title to be displayed
    await waitFor(() => {
      expect(screen.getByText(mockPostTitle)).toBeInTheDocument();
    });
    
    // Verify fetch was called with correct URL
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/posts/prophet-preblitz-class-guide'
    );
  });

  it('handles fetch errors gracefully', async () => {
    // Mock console.error to prevent test output noise
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock the fetch to fail
    global.fetch.mockResolvedValueOnce({
      ok: false,
    });

    render(<Featured />);
    
    // Component should still render even if fetch fails
    expect(screen.getByText(/Your ultimate Legend of Mushrooms reference/i)).toBeInTheDocument();
    
    // Wait a bit to ensure the error handling completes
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
    
    consoleErrorSpy.mockRestore();
  });

  it('renders the prophet character image', () => {
    // Mock the fetch response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ title: 'Test Post Title' }),
    });

    const { container } = render(<Featured />);
    
    // Check if the image is rendered with correct src
    // Note: The image has an empty alt attribute, so it's role="presentation"
    const image = container.querySelector('img[src="/images/prophet-character.png"]');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('width', '512');
    expect(image).toHaveAttribute('height', '512');
  });
});
