import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { CartEntity } from './cart.entity';
  import { ProductEntity } from './product.entity';
  
  @Entity({ name: 'cart_items' })
  export class CartItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => CartEntity, (cart) => cart.id)
    @JoinColumn({ name: 'cart_id' })
    cart: CartEntity;
  
    @Column({ type: 'uuid' })
    product_id: string;
  
    @Column({ type: 'integer' })
    count: number;
  
    @ManyToOne(() => ProductEntity, (product) => product.id)
    @JoinColumn({ name: 'product_id' })
    product: ProductEntity;
  }