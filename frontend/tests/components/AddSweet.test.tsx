import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AddSweet from '../../src/components/admin/AddSweet';

vi.mock('../../src/services/api', () => ({
  default: {
    post: vi.fn()
  }
}));

import api from '../../src/services/api';

describe('AddSweet Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form with all required fields', () => {
    render(<AddSweet onSuccess={vi.fn()} />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/quantity/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add sweet/i })).toBeInTheDocument();
  });

  it('should show validation error when required fields are empty', async () => {
    const user = userEvent.setup();
    render(<AddSweet onSuccess={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /add sweet/i }));

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
  });

  it('should submit form and call onSuccess on success', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    (api.post as ReturnType<typeof vi.fn>).mockResolvedValue({ data: { sweet: {} } });

    render(<AddSweet onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText(/name/i), 'New Sweet');
    await user.type(screen.getByLabelText(/description/i), 'Description');
    await user.type(screen.getByLabelText(/price/i), '5.99');
    await user.type(screen.getByLabelText(/category/i), 'Chocolate');
    await user.type(screen.getByLabelText(/quantity/i), '10');

    await user.click(screen.getByRole('button', { name: /add sweet/i }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('should show error message on API failure', async () => {
    const user = userEvent.setup();
    (api.post as ReturnType<typeof vi.fn>).mockRejectedValue({ 
      response: { data: { message: 'Failed to add sweet' } } 
    });

    render(<AddSweet onSuccess={vi.fn()} />);

    await user.type(screen.getByLabelText(/name/i), 'New Sweet');
    await user.type(screen.getByLabelText(/description/i), 'Description');
    await user.type(screen.getByLabelText(/price/i), '5.99');
    await user.type(screen.getByLabelText(/category/i), 'Chocolate');
    await user.type(screen.getByLabelText(/quantity/i), '10');

    await user.click(screen.getByRole('button', { name: /add sweet/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to add sweet/i)).toBeInTheDocument();
    });
  });
});

