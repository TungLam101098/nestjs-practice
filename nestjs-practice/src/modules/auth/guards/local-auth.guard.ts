import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthStrategies } from '@/enums';

@Injectable()
export class LocalAuthGuard extends AuthGuard(AuthStrategies.Local) {}
