import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

import { Order } from '../models';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from '../entity/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  async findById(orderId: string): Promise<OrderEntity | undefined> {
    return this.orderRepository.findOneBy({id: orderId});
  }

  async create(data: any): Promise<OrderEntity> {
    return this.orderRepository.save({ ...data,  status: 'inProgress'});
  }

  //TODO Updata
  // update(orderId, data) {
  //   const order = this.findById(orderId);

  //   if (!order) {
  //     throw new Error('Order does not exist.');
  //   }

  //   this.orders[ orderId ] = {
  //     ...data,
  //     id: orderId,
  //   }
  // }
}
