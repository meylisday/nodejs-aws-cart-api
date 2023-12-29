import { Module } from '@nestjs/common';
import { OrderService } from './services';
import { OrderEntity } from './entity/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
  ],
  providers: [OrderService],
  exports: [OrderService]
})
export class OrderModule {}
