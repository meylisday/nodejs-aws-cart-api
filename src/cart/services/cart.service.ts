import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
  ): Promise<CartEntity | null> {
    const userCart = await this.cartRepository.findOneBy({ userId: userId });

    if (!userCart) {
      return null;
    }
    
    return userCart;
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
    const userCart = await this.findByUserId(userId);
    if (userCart) {
      console.log('cart', userCart);
      const items = await this.cartItemRepository
        .createQueryBuilder('cartItem')
        .leftJoinAndSelect('cartItem.product', 'product')
        .where('cartItem.cart.id = :cartId', { cartId: userCart.id })
        .getMany();

      return { cart: userCart, items };
    } else {
      const newUserCart = await this.createByUserId(userId);
      return { cart: newUserCart, items: [] as CartItem[] };
    }
  }

  async updateByUserId(userId: string, items: CartItem[]): Promise<{ cart: CartEntity; items: CartItem[] }> {
    const userCart = await this.findByUserId(userId);
    items.forEach((cartItem) => {
      const updatedCartItem = {
        ...cartItem,
        userId,
        cart: userCart
      };
      console.log(updatedCartItem);
      return this.cartItemRepository.save(updatedCartItem);
    });
    return { cart: userCart, items };



    // const userCart = await this.findByUserId(userId);

    // const updatedItems = await Promise.all(items.map(async (cartItem) => {
    //   const cartItemId = cartItem.id;
  
    //   const existingCartItem = await this.cartItemRepository.findOneBy({ id: cartItemId });
  
    //   if (existingCartItem) {
    //     await this.cartItemRepository.save(existingCartItem);
    //     return existingCartItem;
    //   }
    // }));
  
    // return { cart: userCart, items: updatedItems };
  }

  async removeByUserId(userId: string): Promise<CartEntity> {
    const cart = await this.findByUserId(userId);
    const items = await this.getItems(cart);
    await this.cartItemRepository.remove(items);
    return this.cartRepository.remove(cart);
  }

  async updateCartStatus(
    cardId: string,
    newStatus: string,
  ): Promise<CartEntity> {
    const userCart = await this.cartRepository.findOneBy({ id: cardId });

    if (userCart) {
      userCart.status = newStatus;
      return this.cartRepository.save(userCart);
    }

    throw new Error(`Cart with ID ${userCart} not found`);
  }

  async getItems(cart: CartEntity): Promise<CartItem[]> {
    const items = await this.cartItemRepository
    .createQueryBuilder('cartItem')
    .leftJoinAndSelect('cartItem.product', 'product')
    .where('cartItem.cart.id = :cartId', { cartId: cart.id })
    .getMany();

    return items;
  }
}
