import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CartItem } from '@/modules/cart-items/entities/cart-item.entity';
import { CartsModule } from '@/modules/carts/carts.module';
import { Cart } from '@/modules/carts/entities/cart.entity';
import { OrderItem } from '@/modules/order-items/entities/order-item.entity';
import { OrderItemsService } from '@/modules/order-items/order-items.service';

import { Order } from './entities/order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Cart, CartItem]),
    CartsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderItemsService],
  exports: [OrdersService],
})
export class OrdersModule {}
