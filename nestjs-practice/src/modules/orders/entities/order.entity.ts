import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { OrderStatus } from '@/enums';
import { generateOrder } from '@/mocks';
import { OrderItem } from '@/modules/order-items/entities/order-item.entity';
import { User } from '@/modules/users/entities/user.entity';

const { id, userId, status, totalAmount, createdAt } = generateOrder();

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: id,
  })
  id: string;

  @Column()
  @ApiProperty({
    example: userId,
  })
  userId: string;

  @Column()
  @ApiProperty({
    example: totalAmount,
  })
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: status,
  })
  @ApiProperty({
    example: OrderStatus.Pending,
  })
  status: OrderStatus;

  @CreateDateColumn()
  @ApiProperty({
    example: createdAt,
  })
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
  @ApiProperty({
    type: () => [OrderItem],
  })
  items: OrderItem[];
}
