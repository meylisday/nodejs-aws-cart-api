import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { ConfigModule } from '@nestjs/config';
import { CartEntity } from './cart/entity/cart.entity';
import { CartItem } from './cart/entity/cart-item.entity';
import { UserEntity } from './users/entity/user.entity';
import { ProductEntity } from './cart/entity/product.entity';
import { OrderEntity } from './order/entity/order.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    CartModule,
    OrderModule,
    TypeOrmModule.forRootAsync({
      useFactory: async (): Promise<TypeOrmModuleOptions> => {
        const connectionOptions: TypeOrmModuleOptions = {
          type: 'postgres',
          host: process.env.PG_HOST!,
          port: 5432,
          database: process.env.PG_DATABASE!,
          username: process.env.PG_USERNAME!,
          password: process.env.PG_PASSWORD!,
          entities: [CartEntity, CartItem, UserEntity, ProductEntity, OrderEntity],
          synchronize: false,
        };
        console.log('Connection options:', connectionOptions);
        return connectionOptions;
      },
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}