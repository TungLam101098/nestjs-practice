import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { MOCK_CART, MOCK_FOOD } from '@/mocks';
import { Cart } from '@/modules/carts/entities/cart.entity';
import { Food } from '@/modules/foods/entities/food.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: MOCK_CART.CART_ITEM_ID,
  })
  id: string;

  @Column()
  @ApiProperty({
    example: MOCK_CART.ID,
  })
  cartId: string;

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

  @ManyToOne(() => Cart, cart => cart.items)
  @JoinColumn({ name: 'cartId' })
  cart: Cart;

  @ManyToOne(() => Food)
  @JoinColumn({ name: 'foodId' })
  food: Food;
}
