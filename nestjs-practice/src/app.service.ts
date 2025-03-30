import { Injectable } from '@nestjs/common';

import { getCurrentTimestamp } from '@/utils';

@Injectable()
export class AppService {
  healthCheck(): { status: string; timestamp: string } {
    return {
      status: 'OK',
      timestamp: getCurrentTimestamp(),
    };
  }
}
