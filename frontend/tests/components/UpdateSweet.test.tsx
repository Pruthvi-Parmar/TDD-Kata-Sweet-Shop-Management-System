import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UpdateSweet from '../../src/components/admin/UpdateSweet';

vi.mock('../../src/services/api', () => ({
  default: {
    put: vi.fn()
  }
}));

import api from '../../src/services/api';

const mockSweet = {
  _id: '1',
  name: 'Chocolate Truffle',
  description: 'Delicious chocolate truffle',
  price: 5.99,
  category: 'Chocolate',
  quantity: 10,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01'
};

describe('UpdateSweet Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form with pre-filled data', () => {
    render(<UpdateSweet sweet={mockSweet} onSuccess={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByLabelText(/name/i)).toHaveValue('Chocolate Truffle');
    expect(screen.getByLabelText(/description/i)).toHaveValue('Delicious chocolate truffle');
    expect(screen.getByLabelText(/price/i)).toHaveValue(5.99);
    expect(screen.getByLabelText(/category/i)).toHaveValue('Chocolate');
    expect(screen.getByLabelText(/quantity/i)).toHaveValue(10);
  });

  it('should have update and cancel buttons', () => {
    render(<UpdateSweet sweet={mockSweet} onSuccess={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<UpdateSweet sweet={mockSweet} onSuccess={vi.fn()} onCancel={onCancel} />);

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(onCancel).toHaveBeenCalled();
  });

  it('should submit updated data and call onSuccess', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    (api.put as ReturnType<typeof vi.fn>).mockResolvedValue({ data: { sweet: {} } });

    render(<UpdateSweet sweet={mockSweet} onSuccess={onSuccess} onCancel={vi.fn()} />);

    await user.clear(screen.getByLabelText(/name/i));
    await user.type(screen.getByLabelText(/name/i), 'Updated Truffle');
    await user.click(screen.getByRole('button', { name: /update/i }));

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith(`/sweets/${mockSweet._id}`, expect.objectContaining({
        name: 'Updated Truffle'
      }));
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('should show error message on API failure', async () => {
    const user = userEvent.setup();
    (api.put as ReturnType<typeof vi.fn>).mockRejectedValue({
      response: { data: { message: 'Failed to update sweet' } }
    });

    render(<UpdateSweet sweet={mockSweet} onSuccess={vi.fn()} onCancel={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /update/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to update sweet/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for invalid price', async () => {
    const user = userEvent.setup();
    render(<UpdateSweet sweet={mockSweet} onSuccess={vi.fn()} onCancel={vi.fn()} />);

    await user.clear(screen.getByLabelText(/price/i));
    await user.type(screen.getByLabelText(/price/i), '-5');
    await user.click(screen.getByRole('button', { name: /update/i }));

    await waitFor(() => {
      expect(screen.getByText(/price must be positive/i)).toBeInTheDocument();
    });
  });
});

