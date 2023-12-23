import { Module } from '@nestjs/common';
import { OrderModule } from '../order/order.module';
import { CartController } from './cart.controller';
import { CartService } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from './entity/cart.entity';
import { CartItem } from './entity/cart-item.entity';
import { UserEntity } from '../users/entity/user.entity';

@Module({
  imports: [
    OrderModule,
    TypeOrmModule.forFeature([CartEntity, CartItem, UserEntity]),
  ],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}