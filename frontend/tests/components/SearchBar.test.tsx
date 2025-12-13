import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import SearchBar from '../../src/components/sweets/SearchBar';

describe('SearchBar Component', () => {
  it('should render search input and category filter', () => {
    render(<SearchBar onSearch={vi.fn()} />);

    expect(screen.getByPlaceholderText(/search sweets/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should call onSearch with search term when typing', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    await user.type(screen.getByPlaceholderText(/search sweets/i), 'chocolate');

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith(expect.objectContaining({
        name: 'chocolate'
      }));
    });
  });

  it('should call onSearch with category when selecting', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    await user.selectOptions(screen.getByRole('combobox'), 'Chocolate');

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith(expect.objectContaining({
        category: 'Chocolate'
      }));
    });
  });

  it('should have clear button that resets filters', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    await user.type(screen.getByPlaceholderText(/search sweets/i), 'test');
    await user.click(screen.getByRole('button', { name: /clear/i }));

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search sweets/i)).toHaveValue('');
    });
  });
});

