import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CartItem } from '../../cart/entity/cart-item.entity';

@Entity({ name: 'orders' })
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string;

  @Column({ name: 'cart_id', type: 'uuid', nullable: true })
  cartId: string;

  @Column('jsonb', { nullable: true })
  payment: {
    type: string;
    address?: any;
    creditCard?: any;
  };

  @Column('jsonb', { nullable: true })
  delivery: {
    type: string;
    address: any;
  };

  @Column('jsonb', { nullable: true })
  comments: string;

  @Column()
  status: string;

  @Column()
  total: number;
}
