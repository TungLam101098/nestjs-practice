import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { generateFood } from '@/mocks';

const { id, name, description, price, imageUrl, createdAt, updatedAt } =
  generateFood();

@Entity('foods')
export class Food {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: id,
  })
  id: string;

  @Column()
  @ApiProperty({
    example: name,
  })
  name: string;

  @Column()
  @ApiProperty({
    example: description,
  })
  description: string;

  @Column()
  @ApiProperty({
    example: price,
  })
  price: number;

  @Column()
  @ApiProperty({
    example: imageUrl,
  })
  imageUrl: string;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  @ApiProperty({
    example: createdAt,
  })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({
    example: updatedAt,
  })
  updatedAt: Date;
}
