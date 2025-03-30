import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthenticatedUser } from '@/interfaces';
import { CreateUserDto } from '@/modules/users/dtos/create-user.dto';
import { User } from '@/modules/users/entities/user.entity';
import { UsersService } from '@/modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validates user credentials during authentication
   *
   * @param {string} email - User's email address
   * @param {string} pass - User's password to validate
   * @returns {Promise<User | null>} User entity if validation succeeds, null otherwise
   * @throws {InternalServerErrorException} When database query fails
   */
  async validateUser(email: string, pass: string): Promise<User | null> {
    return await this.usersService.validateUser(email, pass);
  }

  /**
   * Generates JWT token for authenticated user
   *
   * @param {AuthenticatedUser} user - Authenticated user data
   * @returns {{ accessToken: string }} Object containing signed JWT token
   */
  login(user: AuthenticatedUser): { accessToken: string } {
    const payload = { id: user.id, email: user.email, role: user.role };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  /**
   * Registers a new user in the system
   *
   * @param {CreateUserDto} registerDto - Data transfer object containing new user details
   * @returns {Promise<{ id: string }>} Object containing the id of the newly created user
   * @throws {ConflictException} When email is already registered
   * @throws {InternalServerErrorException} When registration fails
   */
  async register(registerDto: CreateUserDto): Promise<{ id: string }> {
    return await this.usersService.create(registerDto);
  }
}
