import { CartItem } from '../entity/cart-item.entity';

/**
 * @param {CartItem[]} items
 * @returns {number}
 */
export function calculateCartTotal(items: CartItem[]): number {
  return items
    ? items.reduce((acc: number, { product, count }: CartItem) => {
        const productPrice = product?.price || 0;
        return (acc += productPrice * count);
      }, 0)
    : 0;
}
