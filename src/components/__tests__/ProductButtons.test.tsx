import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import ProductButtons from '../ProductButtons';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import { SerializedProduct } from '@/types/product';

const mockProduct: SerializedProduct = {
  id: 'prod-100',
  name: 'Mechanical Gaming Keyboard',
  description: 'RGB Backlit switches',
  price: 79.99,
  imageUrl: '/keyboard.jpg',
  categoryId: 'cat-1',
  sellerId: 'seller-1',
  stock: 5,
  status: 'ACTIVE',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  nameSlug: 'mechanical-gaming-keyboard',
};

describe('ProductButtons Component', () => {
  it('renders with initial quantity of 1 and active Add to Cart button', () => {
    renderWithProviders(<ProductButtons product={mockProduct} />);

    const input = screen.getByRole('spinbutton') as HTMLInputElement;
    expect(input.value).toBe('1');
    expect(screen.getByText('ADD TO CART')).toBeDefined();
    expect(screen.getByText('(Max:')).toBeDefined();
    expect(screen.getByText('5)')).toBeDefined();
  });

  it('increments quantity when "+" button is clicked up to stock limit', () => {
    renderWithProviders(<ProductButtons product={mockProduct} />);

    const plusBtn = screen.getByRole('button', { name: '+' });
    const input = screen.getByRole('spinbutton') as HTMLInputElement;

    fireEvent.click(plusBtn);
    expect(input.value).toBe('2');

    // Click up to stock limit (5)
    fireEvent.click(plusBtn);
    fireEvent.click(plusBtn);
    fireEvent.click(plusBtn);
    expect(input.value).toBe('5');

    // Button should now be disabled because quantity >= maxStock
    expect((plusBtn as HTMLButtonElement).disabled).toBe(true);
  });

  it('decrements quantity when "-" button is clicked but cannot go below 1', () => {
    renderWithProviders(<ProductButtons product={mockProduct} />);

    const plusBtn = screen.getByRole('button', { name: '+' });
    const minusBtn = screen.getByRole('button', { name: '-' });
    const input = screen.getByRole('spinbutton') as HTMLInputElement;

    // Initially at 1, minus should be disabled
    expect((minusBtn as HTMLButtonElement).disabled).toBe(true);

    fireEvent.click(plusBtn); // quantity = 2
    expect(input.value).toBe('2');
    expect((minusBtn as HTMLButtonElement).disabled).toBe(false);

    fireEvent.click(minusBtn); // quantity = 1
    expect(input.value).toBe('1');
    expect((minusBtn as HTMLButtonElement).disabled).toBe(true);
  });

  it('handles out of stock products correctly', () => {
    const outOfStockProduct: SerializedProduct = {
      ...mockProduct,
      stock: 0,
    };

    renderWithProviders(<ProductButtons product={outOfStockProduct} />);

    // Quantity selector should NOT be rendered when stock is 0
    expect(screen.queryByRole('spinbutton')).toBeNull();

    // Button should display OUT OF STOCK and be disabled
    const addBtn = screen.getByText('OUT OF STOCK').closest('button');
    expect(addBtn).toBeDefined();
    expect(addBtn?.disabled).toBe(true);
  });
});
