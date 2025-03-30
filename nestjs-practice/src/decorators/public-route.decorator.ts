import { SetMetadata } from '@nestjs/common';

import { AuthMetadataKeys } from '@/enums';

/**
 * Decorator to mark routes as public (no authentication required)
 * Used to bypass JWT authentication for specific endpoints
 */
export const IsPublicRoute = () => SetMetadata(AuthMetadataKeys.IsPublic, true);
