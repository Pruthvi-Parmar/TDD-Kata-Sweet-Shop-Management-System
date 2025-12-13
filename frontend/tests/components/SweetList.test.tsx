import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SweetList from '../../src/components/sweets/SweetList';

vi.mock('../../src/services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn()
  }
}));

import api from '../../src/services/api';

const mockSweets = [
  {
    _id: '1',
    name: 'Chocolate Truffle',
    description: 'Delicious chocolate truffle',
    price: 5.99,
    category: 'Chocolate',
    quantity: 10,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    _id: '2',
    name: 'Vanilla Fudge',
    description: 'Creamy vanilla fudge',
    price: 4.99,
    category: 'Fudge',
    quantity: 5,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

describe('SweetList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and display all sweets', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: { sweets: mockSweets } });
    
    render(<SweetList />);

    await waitFor(() => {
      expect(screen.getByText('Chocolate Truffle')).toBeInTheDocument();
      expect(screen.getByText('Vanilla Fudge')).toBeInTheDocument();
    });
  });

  it('should show loading state initially', () => {
    (api.get as ReturnType<typeof vi.fn>).mockImplementation(() => new Promise(() => {}));
    
    render(<SweetList />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should show message when no sweets are available', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: { sweets: [] } });
    
    render(<SweetList />);

    await waitFor(() => {
      expect(screen.getByText(/no sweets available/i)).toBeInTheDocument();
    });
  });

  it('should show error message on API failure', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('API Error'));
    
    render(<SweetList />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
    });
  });
});

