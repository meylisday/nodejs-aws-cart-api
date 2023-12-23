import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartEntity } from '../entity/cart.entity';
import { CartItem } from '../entity/cart-item.entity';
import { v4 } from 'uuid';
import { UserEntity } from '../../users/entity/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findByUserId(
    userId: string,
  ): Promise<{ cart: CartEntity; items: CartItem[] }> {
    const userCart = await this.cartRepository.findOneBy({ userId });

    const items = await this.cartItemRepository
    .createQueryBuilder('cartItem')
    .leftJoinAndSelect('cartItem.product', 'product')
    .where('cartItem.cart.id = :cartId', { cartId: userCart.id })
    .getMany();

    console.log('items', items);
    return { cart: userCart, items };
  }

  async createByUserId(userId: string): Promise<CartEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const newCart: CartEntity = {
      id: v4(),
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'OPEN',
      user,
    };
    return this.cartRepository.save(newCart);
  }

  async findOrCreateByUserId(
    userId: string,
  ): Promise<{ cart: CartEntity; items: CartItem[] }> {
    const { cart } = await this.findByUserId(userId);

    const items = await this.cartItemRepository
    .createQueryBuilder('cartItem')
    .leftJoinAndSelect('cartItem.product', 'product')
    .where('cartItem.cart.id = :cartId', { cartId: cart.id })
    .getMany();

    if (cart) {
      return { cart, items };
    }

    const newUserCart = await this.createByUserId(userId);
    return { cart: newUserCart, items: [] as CartItem[] };
  }

  async updateByUserId(
    userId: string,
    items: CartItem[],
  ): Promise<{ cart: CartEntity; items: CartItem[] }> {
    const userCart = await this.findByUserId(userId);
    items.forEach((cartItem) => {
      const updatedCartItem = {
        ...cartItem,
        userId,
      };
      return this.cartItemRepository.save(updatedCartItem);
    });
    return userCart;
  }

  async removeByUserId(userId: string): Promise<CartEntity> {
    const { cart, items } = await this.findByUserId(userId);
    await this.cartItemRepository.remove(items);
    return this.cartRepository.remove(cart);
  }
}