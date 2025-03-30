import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { MOCK_FOOD, MOCK_ORDER } from '@/mocks';
import { Food } from '@/modules/foods/entities/food.entity';
import { Order } from '@/modules/orders/entities/order.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: MOCK_ORDER.ORDER_ITEM_ID,
  })
  id: string;

  @Column()
  @ApiProperty({
    example: MOCK_ORDER.ID,
  })
  orderId: string;

  @Column()
  @ApiProperty({
    example: MOCK_FOOD.ID,
  })
  foodId: string;

  @Column()
  @ApiProperty({
    example: 1,
  })
  quantity: number;

  @Column()
  @ApiProperty({
    example: MOCK_FOOD.PRICE,
  })
  totalAmount: number;

  @ManyToOne(() => Order, order => order.items)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne(() => Food)
  @JoinColumn({ name: 'foodId' })
  food: Food;
}
