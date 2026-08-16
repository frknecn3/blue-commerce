import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import CartModalProduct from '../CartModalProduct';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import { CartUIItem } from '@/redux/slices/cartSlice';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockCartItem: CartUIItem = {
  id: 'cart-item-1',
  quantity: 2,
  product: {
    id: 'prod-1',
    name: 'Wireless Noise Canceling Headphones',
    imageUrl: '/headphones.jpg',
    price: 99.50,
    stock: 8,
  },
};

describe('CartModalProduct Component', () => {
  it('renders product details, quantity, and calculated total', () => {
    renderWithProviders(<CartModalProduct cartItem={mockCartItem} />);

    expect(screen.getByText('Wireless Noise Canceling Headphones')).toBeDefined();
    expect(screen.getByText('Qty: 2')).toBeDefined();
    // 2 * 99.50 = 199.00
    expect(screen.getByText('$199.00')).toBeDefined();
  });

  it('renders nothing when product data is missing', () => {
    const { container } = renderWithProviders(
      <CartModalProduct cartItem={{ id: 'invalid', quantity: 1, product: null as any }} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('handles item removal click interaction', async () => {
    renderWithProviders(<CartModalProduct cartItem={mockCartItem} />);

    const removeBtn = screen.getByRole('button', { name: 'Remove item' });
    fireEvent.click(removeBtn);

    // During removal, should be disabled and show removing state
    expect((removeBtn as HTMLButtonElement).disabled).toBe(true);
  });
});
