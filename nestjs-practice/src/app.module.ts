import { createKeyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheableMemory } from 'cacheable';
import { Keyv } from 'keyv';

import { dbConfig } from '@/config';
import { AuthModule } from '@/modules/auth/auth.module';
import { CompositeAuthGuard } from '@/modules/auth/guards/composite-auth.guard';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { CartItemsModule } from '@/modules/cart-items/cart-items.module';
import { CartsModule } from '@/modules/carts/carts.module';
import { FoodsModule } from '@/modules/foods/foods.module';
import { OrderItemsModule } from '@/modules/order-items/order-items.module';
import { OrdersModule } from '@/modules/orders/orders.module';
import { UsersModule } from '@/modules/users/users.module';
import { validationSchema } from '@/validations';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CACHE, PORTS } from './constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema,
      isGlobal: true,
      load: [dbConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: dbConfig,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => {
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({
                ttl: CACHE.TTL,
                lruSize: CACHE.LRU_SIZE,
              }),
            }),
            createKeyv(`redis://nest_redis:${PORTS.REDIS}`),
          ],
        };
      },
    }),
    UsersModule,
    AuthModule,
    CartItemsModule,
    CartsModule,
    FoodsModule,
    OrderItemsModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtAuthGuard,
    RolesGuard,
    {
      provide: APP_GUARD,
      useClass: CompositeAuthGuard,
    },
  ],
})
export class AppModule {}
