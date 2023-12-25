import {
  Controller,
  Get,
  Delete,
  Put,
  Body,
  Req,
  Post,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth';
import { OrderService } from '../order';
import { AppRequest, getUserIdFromRequest } from '../shared';

import { calculateCartTotal } from './models-rules';
import { CartService } from './services';

@Controller('api/profile/cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findUserCart(@Req() req: AppRequest) {
    const { cart, items } = await this.cartService.findOrCreateByUserId(
      getUserIdFromRequest(req),
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { cart, items, total: calculateCartTotal(items) },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateUserCart(@Req() req: AppRequest, @Body() body) {
    const { cart, items } = await this.cartService.updateByUserId(getUserIdFromRequest(req), body);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: {
        cart,
        total: calculateCartTotal(items),
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async clearUserCart(@Req() req: AppRequest) {
    await this.cartService.removeByUserId(getUserIdFromRequest(req));

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  async checkout(@Req() req: AppRequest, @Body() body) {
    try {
      const userId = getUserIdFromRequest(req);
      console.log('userID', userId);
      const userCart = await this.cartService.findByUserId(userId);

      console.log('userCart', userCart);
      if (!userCart) {
        const statusCode = HttpStatus.BAD_REQUEST;
        req.statusCode = statusCode;

        return {
          statusCode,
          message: 'Cart is empty',
        };
      }

      const items = await this.cartService.getItems(userCart);

      console.log('items', items);
      
      const total = calculateCartTotal(items);
      const order = await this.orderService.create({
        ...body,
        userId,
        cartId: userCart.id,
        items: items,
        total,
      });

      await this.cartService.updateCartStatus(userCart.id, 'ORDERED');

      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: { order },
      };
    } catch (error) {
      console.error('Error during checkout:', error);

      const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      req.statusCode = statusCode;

      return {
        statusCode,
        message: 'Internal Server Error',
      };
    }
  }
}