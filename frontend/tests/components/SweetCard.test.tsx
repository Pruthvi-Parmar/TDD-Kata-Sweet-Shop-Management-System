import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import SweetCard from '../../src/components/sweets/SweetCard';

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

describe('SweetCard Component', () => {
  it('should display sweet details', () => {
    render(<SweetCard sweet={mockSweet} onPurchase={vi.fn()} />);

    expect(screen.getByText('Chocolate Truffle')).toBeInTheDocument();
    expect(screen.getByText('Delicious chocolate truffle')).toBeInTheDocument();
    expect(screen.getByText('$5.99')).toBeInTheDocument();
    expect(screen.getByText('Chocolate')).toBeInTheDocument();
    expect(screen.getByText(/10 in stock/i)).toBeInTheDocument();
  });

  it('should have purchase button when in stock', () => {
    render(<SweetCard sweet={mockSweet} onPurchase={vi.fn()} />);

    const purchaseButton = screen.getByRole('button', { name: /buy/i });
    expect(purchaseButton).toBeInTheDocument();
    expect(purchaseButton).not.toBeDisabled();
  });

  it('should disable purchase button when out of stock', () => {
    const outOfStockSweet = { ...mockSweet, quantity: 0 };
    render(<SweetCard sweet={outOfStockSweet} onPurchase={vi.fn()} />);

    const purchaseButton = screen.getByRole('button', { name: /out of stock/i });
    expect(purchaseButton).toBeInTheDocument();
    expect(purchaseButton).toBeDisabled();
  });

  it('should call onPurchase when purchase button is clicked', async () => {
    const user = userEvent.setup();
    const onPurchase = vi.fn();
    render(<SweetCard sweet={mockSweet} onPurchase={onPurchase} />);

    await user.click(screen.getByRole('button', { name: /buy/i }));

    expect(onPurchase).toHaveBeenCalledWith(mockSweet._id);
  });

  it('should show out of stock message when quantity is 0', () => {
    const outOfStockSweet = { ...mockSweet, quantity: 0 };
    render(<SweetCard sweet={outOfStockSweet} onPurchase={vi.fn()} />);

    const outOfStockElements = screen.getAllByText(/out of stock/i);
    expect(outOfStockElements.length).toBeGreaterThan(0);
  });
});

