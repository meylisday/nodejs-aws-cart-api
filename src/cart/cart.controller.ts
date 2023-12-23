import {
  Controller,
  Get,
  Delete,
  Put,
  Body,
  Req,
  Post,
  HttpStatus,
} from '@nestjs/common';

// import { BasicAuthGuard, JwtAuthGuard } from '../auth';
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

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Get()
  async findUserCart(@Req() req: AppRequest) {
    const { cart, items } = await this.cartService.findOrCreateByUserId(
      getUserIdFromRequest(req),
    );

    console.log('items', items);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { cart, total: calculateCartTotal(items) },
    };
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Put()
  async updateUserCart(@Req() req: AppRequest, @Body() body) {
    const { cart, items } = await this.cartService.updateByUserId(
      getUserIdFromRequest(req),
      body,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: {
        cart,
        total: calculateCartTotal(items),
      },
    };
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Delete()
  async clearUserCart(@Req() req: AppRequest) {
    await this.cartService.removeByUserId(getUserIdFromRequest(req));

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    };
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Post('checkout')
  async checkout(@Req() req: AppRequest, @Body() body) {
    try {
      const userId = getUserIdFromRequest(req);
      const { cart, items } = await this.cartService.findByUserId(userId);
  
      if (!cart) {
        const statusCode = HttpStatus.BAD_REQUEST;
        req.statusCode = statusCode;
  
        return {
          statusCode,
          message: 'Cart is empty',
        };
      }
  
      const total = calculateCartTotal(items);
      const order = await this.orderService.create({
        ...body,
        userId,
        cartId: cart.id,
        items,
        total,
      });
  
      await this.cartService.removeByUserId(userId);
  
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