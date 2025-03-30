import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { MOCK_CART, MOCK_DATE, MOCK_USER } from '@/mocks';
import { CartItem } from '@/modules/cart-items/entities/cart-item.entity';
import { User } from '@/modules/users/entities/user.entity';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: MOCK_CART.ID,
  })
  id: string;

  @Column()
  @ApiProperty({
    example: MOCK_USER.ID,
  })
  userId: string;

  @CreateDateColumn()
  @ApiProperty({
    example: MOCK_DATE.NOW,
  })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({
    example: MOCK_DATE.NOW,
  })
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => CartItem, cartItem => cartItem.cart, { cascade: true })
  @ApiProperty({
    type: [CartItem],
  })
  items: CartItem[];
}
